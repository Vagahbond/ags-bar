import { App } from "astal/gtk3";
import { Variable, GLib, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Battery from "gi://AstalBattery";
import Tray from "gi://AstalTray";

function trim(str: string, len: number): string {
  return str.length < len ? str : `${str.substring(0, len)}...`;
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box className="SysTray">
      {bind(tray, "items").as((items) =>
        items.map((item) => (
          <menubutton
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
            actionGroup={bind(item, "actionGroup").as((ag) => ["dbusmenu", ag])}
            menuModel={bind(item, "menuModel")}
          >
            <icon gicon={bind(item, "gicon")} />
          </menubutton>
        )),
      )}
    </box>
  );
}

function BatteryLevel() {
  const bat = Battery.get_default();

  return (
    <box className="Battery" visible={bind(bat, "isPresent")}>
      <label
        className={bind(bat, "percentage").as((p) => {
          if (Math.floor(p) === 1) {
            return "full";
          } else if (p < 0.3) {
            return "warning";
          } else if (p < 0.1) {
            return "critical";
          } else return "";
        })}
        label={bind(bat, "percentage").as((p) => {
          const icons = ["󰂃", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󱟢"];

          const icon = bat.charging ? "󰂄" : icons[Math.floor(p * 10)];

          return `${Math.floor(p * 100)}%-${icon}`;
        })}
      />
    </box>
  );
}

function Media() {
  const mpris = Mpris.get_default();

  return (
    <box className="Media">
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box>
            <label
              label={bind(ps[0], "title").as(
                () => ` ${trim(ps[0].title, 20)} - ${trim(ps[0].artist, 20)}`,
              )}
            />
          </box>
        ) : (
          ""
        ),
      )}
    </box>
  );
}

function Workspaces() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Workspaces">
      {bind(hypr, "workspaces").as((wss) =>
        wss
          .filter((ws) => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
          .sort((a, b) => a.id - b.id)
          .map((ws) => (
            <button
              className={bind(hypr, "focusedWorkspace").as((fw) =>
                ws === fw ? "focused" : "",
              )}
              onClicked={() => ws.focus()}
            >
              {ws.id}
            </button>
          )),
      )}
    </box>
  );
}

function FocusedClient() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="Focused" visible={focused.as(Boolean)}>
      {focused.as(
        (client) =>
          client && (
            <label
              label={bind(client, "title").as((t: string) => trim(t, 40))}
            />
          ),
      )}
    </box>
  );
}

function Time({ format = "%H:%M" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!,
  );

  return (
    <label className="Time" onDestroy={() => time.drop()} label={time()} />
  );
}

function Separator() {
  return <label className="Separator" label=""></label>;
}

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const hasTiledWindow = Variable(false);
  const hypr = Hyprland.get_default();

  function hasNoTiledClients() {
    return !!hypr.clients.filter(
      (c) => c.workspace.id === hypr.focusedWorkspace.id && !c.floating,
    ).length;
  }

  bind(hypr, "clients").subscribe((_) => {
    hasTiledWindow.set(hasNoTiledClients());
  });

  bind(hypr, "focusedWorkspace").subscribe((_) => {
    hasTiledWindow.set(hasNoTiledClients());
  });

  return (
    <window
      className={hasTiledWindow((has) => (has ? "Bar" : "Bar NoFocus"))}
      gdkmonitor={monitor}
      heightRequest={30}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
    >
      <centerbox>
        <box hexpand halign={Gtk.Align.START}>
          <Workspaces />
        </box>
        <box>
          <Media />
          <Separator />
          <FocusedClient />
        </box>
        <box hexpand halign={Gtk.Align.END}>
          <SysTray />
          <Time />
          <Separator />
          <BatteryLevel />
        </box>
      </centerbox>
    </window>
  );
}
