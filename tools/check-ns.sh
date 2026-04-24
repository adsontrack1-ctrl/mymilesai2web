#!/usr/bin/env bash
#
# check-ns.sh — poll NS + A + CNAME + MX from 3 independent public resolvers
# until mymilesai.com resolves through Cloudflare's nameservers everywhere.
#
# Run this after flipping GoDaddy nameservers to Cloudflare's in Phase 5D.
# Exits 0 as soon as all three resolvers return Cloudflare NS names.
#
# Usage:
#   bash tools/check-ns.sh              # default: poll every 60s forever
#   bash tools/check-ns.sh --once       # one check, exit
#   bash tools/check-ns.sh --interval 30

set -u

DOMAIN="mymilesai.com"
RESOLVERS=("8.8.8.8:google" "1.1.1.1:cloudflare" "208.67.222.222:opendns")
# Cloudflare-assigned NS hostnames end in .ns.cloudflare.com
CF_NS_SUFFIX=".ns.cloudflare.com"
# Old GoDaddy defaults — fail loudly if we still see these on all resolvers
GODADDY_SUFFIX=".domaincontrol.com"

INTERVAL=60
ONCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --once)     ONCE=1 ; shift ;;
    --interval) INTERVAL="$2" ; shift 2 ;;
    -h|--help)  sed -n '2,12p' "$0" ; exit 0 ;;
    *)          echo "unknown arg: $1" >&2 ; exit 1 ;;
  esac
done

bold() { printf '\e[1m%s\e[0m' "$1"; }
green() { printf '\e[32m%s\e[0m' "$1"; }
red()   { printf '\e[31m%s\e[0m' "$1"; }
yel()   { printf '\e[33m%s\e[0m' "$1"; }

one_pass() {
  local all_cf=1
  local any_godaddy=0
  local banner ; banner=$(date '+%Y-%m-%d %H:%M:%S')
  echo
  bold "── $banner — $DOMAIN ──" ; echo
  for r in "${RESOLVERS[@]}"; do
    local ip="${r%%:*}"
    local name="${r##*:}"
    local ns_raw ; ns_raw=$(dig +short +time=3 +tries=2 NS "$DOMAIN" @"$ip" 2>/dev/null | sort)
    if [[ -z "$ns_raw" ]]; then
      printf '  %-10s %s\n' "$name" "$(red '(no response)')"
      all_cf=0
      continue
    fi
    local status
    if echo "$ns_raw" | grep -q "$CF_NS_SUFFIX"; then
      status=$(green "✓ Cloudflare")
    elif echo "$ns_raw" | grep -q "$GODADDY_SUFFIX"; then
      status=$(yel "… still GoDaddy"); all_cf=0; any_godaddy=1
    else
      status=$(red "? unknown"); all_cf=0
    fi
    printf '  %-10s %s\n' "$name" "$status"
    echo "$ns_raw" | sed 's/^/                /'
  done
  echo
  # Extra: show resolved A record + MX from first resolver that's on Cloudflare
  local first_cf_ip=""
  for r in "${RESOLVERS[@]}"; do
    local ip="${r%%:*}"
    if dig +short NS "$DOMAIN" @"$ip" 2>/dev/null | grep -q "$CF_NS_SUFFIX"; then
      first_cf_ip="$ip"
      break
    fi
  done
  if [[ -n "$first_cf_ip" ]]; then
    echo "  via $first_cf_ip (Cloudflare-authoritative):"
    printf '    A     %s\n' "$(dig +short A "$DOMAIN" @"$first_cf_ip" | paste -sd, -)"
    printf '    CNAME %s\n' "$(dig +short CNAME www."$DOMAIN" @"$first_cf_ip" | paste -sd, -)"
    printf '    MX    %s\n' "$(dig +short MX "$DOMAIN" @"$first_cf_ip" | paste -sd, -)"
  fi
  echo
  if [[ $all_cf -eq 1 ]]; then
    green "✓ Propagated everywhere. Safe to proceed to Phase 6." ; echo
    return 0
  else
    if [[ $any_godaddy -eq 1 ]]; then
      yel "Still waiting on NS propagation. Typical: 2–12 hrs. Budget: 48 hrs." ; echo
    fi
    return 1
  fi
}

while true; do
  if one_pass; then
    exit 0
  fi
  if [[ $ONCE -eq 1 ]]; then
    exit 1
  fi
  sleep "$INTERVAL"
done
