import "./index.css";
import ForegroundColor from "./ForegroundColors";
import BackgroundColor from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import Dimensions from "./Dimensions";
import Corners from "./Corners";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import GridLayout from "./GridLayout";
import Flex from "./Flex"; 
import ReactIconsSampler from "./ReactIcons";
import Container from "./Container";
import BootstrapGrids from "./BootstrapGrids";
import ScreenSizeLabel from "./ScreenSizeLabel";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapForms from "./BootstrapForms";

export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h1>Lab 2</h1>
      <ForegroundColor />
      <BackgroundColor />
      <Borders />
      <Padding />
      <Margins />
      <Dimensions />
      <Corners />
      <Positions />
      <Zindex />
      <Float />
      <GridLayout />
      <Flex />
      <ReactIconsSampler />
      <Container>
        <h2>Lab 2 - Cascading Style Sheets</h2>
        <h3>Styling with the STYLE attribute</h3>
      </Container>
      <BootstrapGrids />
      <ScreenSizeLabel />
      <BootstrapTables />
      <BootstrapLists />
      <BootstrapForms />
    </div>
  );
}
