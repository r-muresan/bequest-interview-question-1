# Tamper Proof Data

## Question
At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

## Assumptions
I worked under the assumption that an authentication layer would be used. This would further restrict data tampering as the session ID can then be traced back to a registered user. Without this, this data is still unprotected/publically accessible.

## Approach and Justification
My goal in my approach was to
  1. Minimize data tampering between the client and server during data transport.
  2. Minimize data tampering via unauthorized API access.
With that In mind, I implemented the following:

- Restricting CORS options (setting specified origin, enabling credentials, limiting request methods)
- Session ID to identify client making changes
- Anti CSRF Token to be renewed on each api call. Without including this, submitting a request to the API will respond with an "unauthorized access" message
- Caching local data that user submits and time submitted (before receiving response from server). While this binds user submission to a specific device/client, this may be useful to indicate a compromised connection to the server if returned data differs from submitted data.
- Sanitization and validation of request data in POST method.

## Answers

1. The client can do the following to ensure the data has not been tampered:
- Reference the session id
- Compare the fetched data to the locally saved copy

2. In my approach, the client stores their submitted data as a cookie. In the event that the fetched data is compromised, the client device can alert the user of the disparity and display the original submission data. 

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
