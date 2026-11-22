# Legal archive

Every version of the Terms of Service (`pages/terms.jsx`) and the Privacy Policy
(`pages/privacy.jsx`) that was published on getpoolnautics.com, kept so we can
show what someone agreed to on a given day. Not linked from the site and not
deployed (only `dist/` is).

**Each time either page changes, add the outgoing version here before the new
one is deployed** (owner, 2026-11-22):

- `<page>-<Updated date>-<commit>.jsx`: the page's source at the last deployed
  commit (`git show <commit>:pages/<page>.jsx`).
- `<page>-<Updated date>-<commit>.live.html`: the page as getpoolnautics.com
  served it then (`curl https://getpoolnautics.com/<page>`).

The commit is in the name because two versions can carry the same "Updated"
date (2026-11-22 had several).

`counsel-packet.md`, the review packet for our lawyer, is kept on the
machine that made it and not committed (it quotes the web app's private
source; `.gitignore`).
