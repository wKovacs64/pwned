---
'pwned': patch
---

Exit process with code `1` on errors/failures to assist with scripting, CI/CD, and other automation. Technically, one could argue this is a breaking change, but I'm justifying it as a patch as it should have worked this way all along. So if this affects you, sorry - you were relying on a bug. ;)
