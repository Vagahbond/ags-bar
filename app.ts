import Bar from "./widget/bar";
import { App } from "astal/gtk3";
import Style from "./style.scss";

App.start({
  css: Style,
  main() {
    App.get_monitors().map(Bar);
  },
});
