import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";

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
        <EventObject />
        <Counter />
    </div>  );
    }
