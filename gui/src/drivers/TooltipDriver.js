import Tooltip from "../components/Tooltip_0_1_0";

const infoDefault = "This is a tooltip text";
const infoLong =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed varius lectus. Nam non sollicitudin tortor. Nullam sem turpis, fringilla non aliquet tempor, convallis ut arcu. Morbi vitae luctus lectus. Pellentesque finibus aliquet pulvinar. Fusce non molestie turpis. Curabitur urna risus, aliquet ac tellus et, hendrerit malesuada nisl. Donec nec elementum orci. Praesent cursus sodales dolor, sit amet malesuada neque suscipit ut. Donec quam leo, auctor imperdiet diam eget, scelerisque sollicitudin arcu. Aliquam bibendum egestas turpis, eget tincidunt nisl fringilla lobortis. Donec porttitor mauris sit amet eros volutpat volutpat.";

export default function TooltipDriver() {
  return (
    <>
      <h1>Tooltip text</h1>
      <h2>Default</h2>
      <Tooltip info={infoDefault}>
        <div>TEST</div>
      </Tooltip>
      <h2>Long</h2>
      <Tooltip info={infoLong}>
        <div>TEST</div>
      </Tooltip>
    </>
  );
}
