interface MagicLinkEmailProps {
  name: string;
  magicLinkUrl: string;
  expiresMinutes: number;
  companyName?: string;
}

export function magicLinkEmail({
  name,
  magicLinkUrl,
  expiresMinutes,
  companyName = "FlowCRM",
}: MagicLinkEmailProps): string {
  return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Toegangslink klantportaal</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
    style="background-color:#f0f2f8;padding:48px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- ── Header ── -->
          <tr>
            <td style="background:#0c0e12;padding:28px 40px;">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="width:36px;height:36px;background:#4f7cff;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;line-height:36px;display:block;">&#9889;</span>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">${esc(companyName)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Eyebrow label ── -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 10px;font-size:11px;color:#8b93b0;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">
                Klantportaal toegang
              </p>
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0c0e12;line-height:1.3;">
                Hallo ${esc(name)},
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#4a5070;line-height:1.7;">
                Je hebt een toegangslink aangevraagd voor het klantportaal van <strong style="color:#0c0e12;">${esc(companyName)}</strong>.
                Klik op de knop hieronder om direct in te loggen en je offertes en facturen te bekijken.
              </p>
            </td>
          </tr>

          <!-- ── CTA button ── -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="background:#4f7cff;border-radius:10px;">
                    <a href="${magicLinkUrl}"
                      style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;white-space:nowrap;">
                      Inloggen op het portaal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Expiry notice ── -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                style="background:#f8f9fc;border-radius:10px;border:1px solid #eaecf4;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#4a5070;line-height:1.6;">
                      <span style="color:#8b93b0;font-weight:600;">&#9432; Let op:</span>
                      Deze link is <strong style="color:#0c0e12;">&#233;&#233;nmalig</strong> te gebruiken en verloopt
                      over <strong style="color:#0c0e12;">${expiresMinutes} minuten</strong>.
                      Heb je geen toegangslink aangevraagd? Je kunt deze e-mail veilig negeren &mdash;
                      er is geen actie vereist.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Divider + fallback URL ── -->
          <tr>
            <td style="padding:0 40px 32px;border-top:1px solid #f0f2f8;">
              <p style="margin:24px 0 6px;font-size:12px;color:#b0b8cc;">
                Werkt de knop niet? Kopieer en plak de onderstaande link in je browser:
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="${magicLinkUrl}" style="color:#4f7cff;word-break:break-all;text-decoration:none;">${magicLinkUrl}</a>
              </p>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:#f8f9fc;padding:20px 40px;border-top:1px solid #eaecf4;">
              <p style="margin:0;font-size:11px;color:#b0b8cc;line-height:1.6;text-align:center;">
                Dit is een automatisch gegenereerde e-mail van ${esc(companyName)}. Reageer niet op dit bericht.<br/>
                &copy; ${new Date().getFullYear()} ${esc(companyName)}
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->

</body>
</html>`;
}

// Minimal HTML escape for user-supplied strings inside the template
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
