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
        <h5>Text boxes</h5>
        <label>Biography:</label><br/>
        <textarea id="wd-textarea" cols={30} rows={10}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</textarea>
        <h5 id="wd-buttons">Buttons</h5>
        <button type="button"
                onClick={() => alert("Life is Good!")}
                id="wd-all-good">
        Hello World!
        </button>

        <h4 id="wd-dropdowns">Dropdowns</h4>

        <h5>Select one</h5>
        <label  htmlFor="wd-select-one-genre"> Favorite movie genre: </label><br/>
        <select id="wd-select-one-genre">
        <option value="COMEDY">Comedy</option>
        <option value="DRAMA">Drama</option>
        <option selected value="SCIFI">
            Science Fiction</option>
        <option value="FANTASY">Fantasy</option>
        </select>
        <h5>Select many</h5>
        <label  htmlFor="wd-select-many-genre"> Favorite movie genres: </label><br/>
        <select multiple id="wd-select-many-genre">
        <option value="COMEDY" selected> Comedy          </option>
        <option value="DRAMA">           Drama           </option>
        <option value="SCIFI"  selected> Science Fiction </option>
        <option value="FANTASY">         Fantasy         </option>
        </select>
      </div>      
);
}
  