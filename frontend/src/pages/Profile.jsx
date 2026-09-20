import "./Profile.css";

function Profile({ setCurrentPage }) {

  return (
    <div className="profile-page">

      {/* PAGE HEADER */}

      <div className="profile-page-header">

        <div>
          <h1>Admin Profile</h1>
          <p>
            View administrator account and security information.
          </p>
        </div>

        <button
          className="profile-back-button"
          onClick={() => setCurrentPage("overview")}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* PROFILE CARD */}

      <div className="profile-main-card">

        <div className="profile-avatar-large">
          👤
        </div>

        <div className="profile-main-info">

          <h2>Admin User</h2>

          <p className="profile-role">
            Security Analyst
          </p>

          <span className="profile-status">
            ● Active
          </span>

        </div>

      </div>


      {/* PERSONAL INFORMATION */}

      <div className="profile-section">

        <div className="profile-section-title">

          <h2>Personal Information</h2>

          <p>
            Administrator account details.
          </p>

        </div>


        <div className="profile-details-grid">

          <div className="profile-detail">

            <span>Full Name</span>

            <strong>
              Admin User
            </strong>

          </div>


          <div className="profile-detail">

            <span>Username</span>

            <strong>
              admin
            </strong>

          </div>


          <div className="profile-detail">

            <span>Email</span>

            <strong>
              admin@netrix.com
            </strong>

          </div>


          <div className="profile-detail">

            <span>Role</span>

            <strong>
              Security Analyst
            </strong>

          </div>


          <div className="profile-detail">

            <span>Access Level</span>

            <strong>
              Administrator
            </strong>

          </div>


          <div className="profile-detail">

            <span>Account Status</span>

            <strong className="active-text">
              Active
            </strong>

          </div>

        </div>

      </div>


      {/* ACCOUNT INFORMATION */}

      <div className="profile-section">

        <div className="profile-section-title">

          <h2>Account Information</h2>

          <p>
            Current Netrix account configuration.
          </p>

        </div>


        <div className="profile-details-grid">

          <div className="profile-detail">

            <span>Account Type</span>

            <strong>
              Administrator
            </strong>

          </div>


          <div className="profile-detail">

            <span>Authentication</span>

            <strong>
              Dashboard Account
            </strong>

          </div>


          <div className="profile-detail">

            <span>Session Status</span>

            <strong className="active-text">
              Active
            </strong>

          </div>


          <div className="profile-detail">

            <span>Last Login</span>

            <strong>
              Current Session
            </strong>

          </div>

        </div>

      </div>


      {/* SECURITY ACCESS */}

      <div className="profile-section">

        <div className="profile-section-title">

          <h2>Security & Permissions</h2>

          <p>
            Access available to the administrator account.
          </p>

        </div>


        <div className="permission-list">

          <div className="permission-row">

            <span>
              Threat Analysis
            </span>

            <strong>
              Enabled
            </strong>

          </div>


          <div className="permission-row">

            <span>
              Security Incidents
            </span>

            <strong>
              Enabled
            </strong>

          </div>


          <div className="permission-row">

            <span>
              Security Reports
            </span>

            <strong>
              Enabled
            </strong>

          </div>


          <div className="permission-row">

            <span>
              Network Monitoring
            </span>

            <strong>
              Enabled
            </strong>

          </div>


          <div className="permission-row">

            <span>
              Dashboard Settings
            </span>

            <strong>
              Enabled
            </strong>

          </div>

        </div>

      </div>


      {/* PROFILE NOTICE */}

      <div className="profile-notice">

        <div className="notice-icon">
          i
        </div>

        <div>

          <strong>
            Administrator Account
          </strong>

          <p>
            This profile represents the administrator account
            used to access the Netrix Cyber Defense Dashboard.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Profile;