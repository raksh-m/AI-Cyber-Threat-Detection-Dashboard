import "./Users.css";

function Users({ analysis }) {

  const totalTraffic = analysis?.totalTraffic || 0;
  const totalThreats = analysis?.threats || 0;

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>
            User-related security information from the analyzed dataset.
          </p>
        </div>
      </div>

      <div className="users-summary">

        <div className="user-card">
          <span>Traffic Records</span>
          <strong>{totalTraffic.toLocaleString()}</strong>
          <small>Analyzed network records</small>
        </div>

        <div className="user-card">
          <span>Threat Records</span>
          <strong>{totalThreats.toLocaleString()}</strong>
          <small>Records classified as threats</small>
        </div>

        <div className="user-card">
          <span>User Records</span>
          <strong>0</strong>
          <small>Not available in dataset</small>
        </div>

      </div>

      <div className="users-section">

        <div className="users-icon">
          👤
        </div>

        <h2>User Information Not Available</h2>

        <p>
          The currently uploaded network dataset does not contain
          user identity or account information. Therefore, Netrix
          does not generate or display artificial user records.
        </p>

        <div className="available-fields">

          <h3>Available Analysis Information</h3>

          <div className="field-row">
            <span>Network Traffic</span>
            <strong>Available</strong>
          </div>

          <div className="field-row">
            <span>Threat Detection</span>
            <strong>Available</strong>
          </div>

          <div className="field-row">
            <span>User Identity</span>
            <strong>Not Available</strong>
          </div>

          <div className="field-row">
            <span>Username</span>
            <strong>Not Available</strong>
          </div>

          <div className="field-row">
            <span>Account Information</span>
            <strong>Not Available</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Users;