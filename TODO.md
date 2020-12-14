- Divorce angular and aws
- Set up webpack for aws
- Add Unit / Integration tests (const AWS = AWSXRay.capture)
- Tidy dependencies / devDependencies

---

Legacy:

- Reset password field after form submit
  - Password form variable is hashed on client-end so when errors are returned and the form is resubmitted the value in the form is hashed whilst passwordConfirm doesn't change. Setting passwordConfirm = the hash of the original password would then has the already-hashed password causing user to be unable to login due to double hashing
- Refactor
- Add comments
