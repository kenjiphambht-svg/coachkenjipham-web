# B4 — Private Publication / Storage gate

Bucket `hatmam-publications-private` is designed private, accepts PDF only and limits each object to 10 MB. Asset metadata can contain only a UUID-based object path and checksum; it must never contain a child name, birth data or a signed URL.

The bucket is not a release approval. Before `hatmam_release_gates.private_storage_ready` may become true, staging must prove with a dummy PDF: service-role upload, unauthenticated denial, non-admin denial, AAL1 denial, AAL2 admin metadata access, token-gated short-lived download, expiry/revocation denial, checksum verification, and deletion. This is intentionally blocked until that controlled Storage integration test exists. No customer document is permitted.
