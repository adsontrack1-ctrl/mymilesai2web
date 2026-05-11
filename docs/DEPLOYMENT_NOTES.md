# Deployment Notes

## Trip schema

The KPI loader in `assets/js/app.js` reads from the real columns on `public.trips`:

- `miles` (not `distance_mi`)
- `trip_date` (not `started_at`)
- `type` in `('business','personal','unclassified')`
- filter `deleted_at IS NULL`

This mirrors the write path used by the RN v2 iOS app (`~/Developer/MyMilesAi-2/src/lib/repos/trips.ts`).

## DNS cutover

Deliberately not part of the current deploy. The current live `mymilesai.com` is served by the `mile-tracker-1` repo's GitHub Pages custom domain. Switching is a separate, gated phase:

- **Phase 5:** Cloudflare zone create → mirror GoDaddy records → flip nameservers at GoDaddy. 24-48 hr propagation window.
- **Phase 6:** Remove custom domain from `mile-tracker-1`, add it here, verify cert provisioning. Leave Cloudflare proxy grey / DNS-only until the Pages cert is issued; then optionally flip to orange.

### Record mirror set (GoDaddy → Cloudflare)

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | @ | 185.199.108.153 | DNS only |
| A | @ | 185.199.109.153 | DNS only |
| A | @ | 185.199.110.153 | DNS only |
| A | @ | 185.199.111.153 | DNS only |
| CNAME | www | adsontrack1-ctrl.github.io | DNS only |
| MX | @ | 0 mymilesai-com.mail.protection.outlook.com | N/A |
| TXT | @ | "NETORGFT20431510.onmicrosoft.com" | N/A |
| TXT | @ | "v=spf1 include:secureserver.net -all" | N/A |

**Missing MX/TXT = broken email.** Verify mail routing after NS flip before Phase 6.
