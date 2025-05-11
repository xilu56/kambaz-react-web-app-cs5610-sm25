export default function Lab1() {
    return (
        <div id="wd-forms">
        <h4>Form Elements</h4>
        <form id="wd-text-fields">
          <h5>Text Fields</h5>
          <label htmlFor="wd-text-fields-username">Username:</label>
          <input placeholder="jdoe" id="wd-text-fields-username" /> <br />
          <label htmlFor="wd-text-fields-password">Password:</label>
          <input type="password" value="123@#$asd" id="wd-text-fields-password" />
          <br />
          <label htmlFor="wd-text-fields-first-name">First name:</label>
          <input type="text" title="John" id="wd-text-fields-first-name" /> <br />
          <label htmlFor="wd-text-fields-last-name">Last name:</label>
          <input type="text" placeholder="Doe"
                 value="Wonderland"
                 title="The last name"
                 id="wd-text-fields-last-name" />
        </form>
      </div>      
);
}
  