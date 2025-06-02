import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";

export default function Lab4() {
    function sayHello() {
        alert("Hello");
    }
  return (
    <div>
      <h3>JavaScript Events</h3>
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction= {sayHello} />
    </div>  );
    }
    