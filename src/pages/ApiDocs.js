import "../styles/ApiDocs.scss";
import CodeBlock from "../components/CodeBlock";

const ApiDocs = () => {
  return (
    <div className="container apidocs fg1">
      <h2 className="api-name">PushNotify API 🚀</h2>
      <p>
        <strong>
          A powerful API to generate JWT tokens, store device tokens, and send
          push notifications with ease.
        </strong>
      </p>

      <h2>📌 About PushNotify API</h2>
      <p>
        PushNotify API simplifies{" "}
        <strong>
          Firebase Cloud Messaging (FCM) for IoT devices, low-end
          microcontrollers, and web applications
        </strong>{" "}
        by handling the complexities of authentication and message delivery.
        <br />
        <br />
        Many <strong>low-end devices, such as ESP8266 and ESP32</strong>, lack
        the processing power to generate JWT tokens required for FCM
        authentication. PushNotify solves this by{" "}
        <strong>
          offloading JWT signing and Firebase token management to a cloud-based
          API
        </strong>
        , allowing resource-constrained devices to send push notifications with
        minimal overhead.
        <br />
        <br />
        With <strong>secure device token storage</strong>,{" "}
        <strong>automated Firebase access token handling</strong>, and{" "}
        <strong>a simple API for triggering notifications</strong>, PushNotify
        ensures reliable communication for both high-performance applications
        and lightweight microcontroller-based systems.
      </p>

      <h2>⚠️ Problem Statement</h2>
      <p>Challenges in traditional push notification implementations:</p>
      <ul>
        <li>
          <strong>JWT Token Generation:</strong> Microcontrollers can't generate
          JWT tokens for Firebase.
        </li>
        <li>
          <strong>Device Token Management:</strong> Storing and handling
          multiple device tokens is complex.
        </li>
        <li>
          <strong>Push Notification Complexity:</strong> Managing authentication
          and API calls is difficult.
        </li>
      </ul>

      <h2>✅ Solution: PushNotify API</h2>
      <ul>
        <li>
          <strong>Automated JWT Generation:</strong> No need for device-side
          token signing.
        </li>
        <li>
          <strong>Effortless Device Registration:</strong> Stores and updates
          device tokens easily.
        </li>
        <li>
          <strong>One-Step Push Notifications:</strong> A single request sends
          messages to registered devices.
        </li>
      </ul>

      <h2>🔧 How to Use the API</h2>
      <p>
        <strong>Base URL:</strong>
      </p>

      <CodeBlock
        mode="minimal"
        code="https://bsuf2bagnak4a7bcn2244z2ymi0ikygr.lambda-url.eu-north-1.on.aws/"
      />

      <p>
        • Send Post request in the above url along with the body structure as
        shown below.
      </p>
      <p>
        • Use access token in the body, you'll be provided a test token for that
        in the user dashboard which is free for development.
      </p>
      <p>
        • For production use, you'll be needed to one time purchase for the api
        access token.
      </p>

      <h2>📌 API Endpoints</h2>

      <h3>1️⃣ Generate JWT Token</h3>
      <p>
        Use this endpoint to generate a Firebase authentication token (JWT). ({" "}
        <i>use your custom server, no need for further steps.</i> )
      </p>

      <CodeBlock
        mode="minimal"
        code={`{
    "type": "generate-jwt",
    "access-token": "your-access-token",
    "client-email": "your-service-account-client-email",
    "private-key": "your-service-account-private-key"
}`}
      />

      <h4>✅ Sample Response:</h4>
      <CodeBlock
        mode="minimal"
        code={`{
    "payload": {
        "iss": "your-service-account-client-email",
        "scope": "https://www.googleapis.com/auth/firebase.messaging",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": 1710234567,
        "exp": 1710238167
    },
    "jwt": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OT..."
}`}
        className="sample-response"
      />

      <h3>2️⃣ Save Device Token (Receiver Side)</h3>
      <p>
        Register a device token and receive a unique device ID. This process is
        handled from the app side (receiver side).
      </p>
      <p>
        <strong>Note:</strong> Store the device ID for further use.
      </p>

      <CodeBlock
        mode="minimal"
        code={`{  
    "type": "save-token",
    "access-token": "your-access-token",  
    "device-token": "your_fcm_token"  
}`}
      />

      <h4>✅ Sample Response:</h4>
      <p>• If new device token registered.</p>
      <CodeBlock
        mode="minimal"
        code={`{
    "message": "New device token saved",
    "device_id": "abc123def456ghi7"
}`}
      />

      <p>• If device token updated.</p>
      <CodeBlock
        mode="minimal"
        code={`{
    "message": "Device token updated",
    "device_id": "existing-device-id"
}`}
        className="sample-response"
      />

      <h2 style={{ color: "red", marginBottom: "8px" }}>Error Handling</h2>
      <h4>• If Access Token Not Passed.</h4>
      <CodeBlock
        mode="minimal"
        code={`{
    "type": "error",
    "message": "Unauthorized Access"
}`}
      />

      <h4>• If Access Token Not Registered.</h4>
      <CodeBlock
        mode="minimal"
        code={`{
    "type": "error",
    "message": "Invalid Access Token"
}`}
        className="sample-response"
      />

      <h3>3️⃣ Send Push Notification (Sender / IoT Device Side)</h3>
      <p>
        Send a notification from the IoT device (sender side) to a registered
        device using its unique ID.
      </p>

      <CodeBlock
        mode="minimal"
        code={`{  
    "type": "push-fcm",  
    "access-token": "your-access-token",
    "device-id": "your_device_id",  
    "title": "Hello!",  
    "body": "This is a test notification",  
    "payload": { "key": "value" }  
}`}
      />

      <h4>✅ Sample Response:</h4>
      <CodeBlock
        mode="minimal"
        code={`{
    "success": true,
    "message": "Notification sent successfully"
}`}
        className="sample-response"
      />

      <h2>🛠 Test the API with cURL</h2>

      <h3>1️⃣ Generate JWT Token</h3>
      <CodeBlock
        mode="minimal"
        code={`curl -X POST "https://bsuf2bagnak4a7bcn2244z2ymi0ikygr.lambda-url.eu-north-1.on.aws/" \ 
-H "Content-Type: application/json" \  
-d '{"type":"generate-jwt","access-token": "your-access-token","client-email":"your-email","private-key":"your-private-key"}'`}
      />

      <h3>2️⃣ Save Device Token</h3>
      <CodeBlock
        mode="minimal"
        code={`curl -X POST "https://bsuf2bagnak4a7bcn2244z2ymi0ikygr.lambda-url.eu-north-1.on.aws/" \  
-H "Content-Type: application/json" \  
-d '{"type":"save-token","access-token": "your-access-token", "device-token":"your_fcm_token"}'`}
      />

      <h3>3️⃣ Send Push Notification</h3>
      <CodeBlock
        mode="minimal"
        langaug="curl"
        code={`curl -X POST "https://bsuf2bagnak4a7bcn2244z2ymi0ikygr.lambda-url.eu-north-1.on.aws/" \  
-H "Content-Type: application/json" \  
-d '{"type":"push-fcm", "access-token": "your-access-token","device-id":"your_device_id","title":"Hello","body":"Test Message","payload":{"key":"value"}}'`}
      />
    </div>
  );
};

export default ApiDocs;
