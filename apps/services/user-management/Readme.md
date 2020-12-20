## Introduction
This can also be called a DID Service. 

For SSI applications, a user's digital ID should be a lifetime portable digital identity that does not depend on any centralized authority. Such an identifier fulfills these four requirements: 
- persistence
- global resolvability
- cryptographic verifiability
- decentralization

### What is DID?
DIDs follow the basic pattern of the URN specification, which is `urn:uuid:fe0cde11-59d2-4621-887f-23013499f905`
where the first part is the `scheme`, 2nd part is the `namespace` and the last part is a namespace specific string

A DID format looks like `did:example:12345abcde`

here, the first part is the `scheme`, 2nd part is the namespace which identifies a `DID method`, and the last part is a DID method-specific identifier

## Main Features
- User Management
  - New User Registration
  - Username Update
  - Password Update
  - Password Recovery/Reset
- Access Management
  - Password/Passwordless Login
  - Logout


<!-- TODO: update accordingly -->
## Flows

### User Registration Flows

#### With Email/Phone Number
- Given a *phone number or email* as a username, and a password, signup the user by making a request `post('/api/v1/users/signup')` with input `signUpParams = { username, password }`

- The successful response will be status code `200` and a `token`. The user will also receive a `confirmationCode` (also known as OTP or One-Time-Password) at the provided email address or phone number

- To complete the signup, using the `token` and the `confirmationCode`, make a request `post('/api/v1/users/signup/confirm')` with input `signUpConfirmParams = { token, confirmationCode }`

- The successful response will be status code `200` along with `did` and `accessToken`

  - The `accessToken` will be used as the bearer token (Authorization Header) in subsequent requests

#### With Arbitrary Username
- Given an arbitrary string as a username, and a password, signup the user by making a request `post('/api/v1/users/signup')` with input `signUpParams = { username, password }`

- The successful response will be status code `200` along with `did` and `accessToken`

  - The `accessToken` will be used as the bearer token (Authorization Header) in subsequent requests


For more details, see [User Registration Details]('./../docs/user-registration-details.md)

### Change Username to Email Flow
  - Given the [User Registration Flow](#user-registration-flow) is complete, i.e
    - a user has a valid username and password, and is currently logged in

  - Make a request `post('/api/v1/users/change-username')` with the input `changeUsernameParams = { username: email }`

  - Once the new input value is validated, and the response status code is `204`, a `confirmationCode` will be sent to the new email address

  - Next, confirm the username update using the OTP, by making a request `post('/api/v1/users/change-username/confirm')` with input `changeUsernameConfirmParams = { username: email, confirmationCode }`

  - If the OTP is valid, the username update will be completed and the user will remain logged in

  - After this point, if the user logs out, they will be able to login using the new username and not the old one

### Change Password Flow
  - Given the [User Registration Flow](#user-registration-flow) is complete, i.e
    - a user has a valid username and password, and is currently logged in

  - Make a request `put('/api/v1/users/change-password')` with the input `changePasswordParams = { oldPassword: password, newPassword }`

  - Once the new input value is validated, the response status code is `204`

  - Finally, log the user out and log them back in using the new password, as follows:
    - `post('/api/v1/users/logout')`
    - `post('/api/v1/users/login')` with input of `loginParams = { username, password: newPassword }`

### Reset Password Flow
  - Given the [User Registration Flow](#user-registration-flow) is complete, i.e
    - a user has a valid username
    - but they have forgotten their password, and are not currently logged in

  - Make a request `post('/api/v1/users/forgot-password')` with the input `forgotPasswordParams = { username }`

  - Once the username is validated, the user will receive a `confirmationCode` at their email

  - Confirm the new password by making a request `post('/api/v1/users/forgot-password/confirm')` with the input `forgotPasswordSubmitParams = { username, otp: confirmationCode, newPassword }`

  - Finally, log the user in using the new password using `post('/api/v1/users/login')` with input of `loginParams = { username, password: newPassword }`

  - The successful response will be status code `200` and a new `accessToken`
