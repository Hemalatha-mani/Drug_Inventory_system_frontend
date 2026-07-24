import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import "../css/Settings.css";

function Settings() {

const API_URL =
"http://localhost:8080/api/settings";

const [settings,setSettings] =
useState({});

useEffect(()=>{

loadSettings();

},[]);

const loadSettings = async()=>{

const result =
await axios.get(API_URL);

setSettings(result.data);

};

const handleChange = (e)=>{

setSettings({

...settings,

[e.target.name]:
e.target.value

});

};

const saveSettings = async () => {
  try {

    await axios.put(
      "http://localhost:8080/api/settings",
      settings
    );

    alert("Settings Saved Successfully");

  } catch (error) {

    console.error(error);

    alert("Error Saving Settings");
  }
};

const runBackup = async () => {

  try {

    const result =
      await axios.get(
        "http://localhost:8080/api/backup/run"
      );

    alert(result.data);

  } catch(error) {

    console.error(error);

    alert("Backup Failed");
  }
};

return(

<div className="settings-page">

<h2>
System Settings
</h2>

<div className="settings-grid">

<div className="settings-card">

<h3>
Organization Details
</h3>

<input
name="hospitalName"
value={settings.hospitalName||""}
onChange={handleChange}
placeholder="Hospital Name"
/>

<input
name="email"
value={settings.email||""}
onChange={handleChange}
placeholder="Email"
/>

<input
name="phone"
value={settings.phone||""}
onChange={handleChange}
placeholder="Phone"
/>

</div>

<div className="settings-card">

<h3>
Inventory Settings
</h3>

<input
name="lowStockThreshold"
value={
settings.lowStockThreshold||""
}
onChange={handleChange}
placeholder="Low Stock Threshold"
/>

<input
name="expiryAlertDays"
value={
settings.expiryAlertDays||""
}
onChange={handleChange}
placeholder="Expiry Alert Days"
/>

</div>

<div className="settings-card">

<h3>Notifications</h3>

<div className="toggle-row">

<label>Email Notifications</label>

<input
type="checkbox"
checked={
settings.emailNotifications === "Enabled"
}
onChange={(e) =>
setSettings({
...settings,
emailNotifications:
e.target.checked
? "Enabled"
: "Disabled"
})
}
/>

</div>

<div className="toggle-row">

<label>SMS Notifications</label>

<input
type="checkbox"
checked={
settings.smsNotifications === "Enabled"
}
onChange={(e) =>
setSettings({
...settings,
smsNotifications:
e.target.checked
? "Enabled"
: "Disabled"
})
}
/>

</div>

</div>
<div className="settings-card">

<h3>
Backup Settings
</h3>

<select
name="backupFrequency"
value={
settings.backupFrequency||""
}
onChange={handleChange}
>

<option>
Daily
</option>

<option>
Weekly
</option>

<option>
Monthly
</option>

</select>
<button
className="backup-btn"
onClick={runBackup}
>
Run Backup Now
</button>

</div>

</div>

<button
className="save-btn"
onClick={saveSettings}
>
Save Settings
</button>

</div>

);

}

export default Settings;