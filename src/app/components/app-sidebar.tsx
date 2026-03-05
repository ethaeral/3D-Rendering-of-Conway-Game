import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "../../components/ui/sidebar";
import { Switch } from "../../components/switch";
import { Switch as ShadcnSwitch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Slider as ShadcnSlider } from "../../components/ui/slider";
import { CONWAY_GRID_MIN, CONWAY_GRID_MAX } from "../../config/conway";
import type { ConwayLayoutContext } from "../conway-layout";
import type { ComputeStrategy, GridDimensions } from "../../features/conway/worker/conway-rules";
import { STRATEGIES_V1, STRATEGIES_V2 } from "../../features/conway/worker/conway-strategy-metadata";
import { MAP_RULE_PRESETS } from "../../features/boston-map/rules/presets";
import type { MapRulePresetId } from "../../features/boston-map/rules/types";

const VERSIONS = [
  { path: "/v1", label: "V1 · 2020: DOM" },
  { path: "/v2", label: "V2 · 2026: WebGL" },
  { path: "/v3", label: "V3 · 2026: ArcGIS" },
] as const;

type VersionPath = (typeof VERSIONS)[number]["path"];

function getCurrentVersionPath(pathname: string): VersionPath {
  if (pathname.startsWith("/v3")) return "/v3";
  if (pathname.startsWith("/v2")) return "/v2";
  return "/v1";
}

const SELECT_CLASSES = cn(
  "w-full rounded-md border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] px-2 py-1.5 text-xs font-medium text-[hsl(var(--sidebar-foreground))]",
  "focus:outline-none focus:ring-1 focus:ring-[hsl(var(--sidebar-primary))] focus:ring-offset-1",
  "hover:bg-[hsl(var(--sidebar-accent))] cursor-pointer"
);

function VersionSelect() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath = getCurrentVersionPath(pathname);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Version</SidebarGroupLabel>
      <select
        value={currentPath}
        onChange={(e) => navigate(e.target.value as VersionPath)}
        className={SELECT_CLASSES}
      >
        {VERSIONS.map(({ path, label }) => (
          <option key={path} value={path}>
            {label}
          </option>
        ))}
      </select>
    </SidebarGroup>
  );
}

function DimensionsToggle({
  dimensions,
  setDimensions,
}: {
  dimensions: GridDimensions;
  setDimensions: (d: GridDimensions) => void;
}) {
  const is3D = dimensions === 3;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dimension</SidebarGroupLabel>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-medium cursor-pointer select-none",
            !is3D && "text-[hsl(var(--sidebar-foreground))]",
            is3D && "text-[hsl(var(--sidebar-muted-foreground))]"
          )}
          onClick={() => setDimensions(2)}
          onKeyDown={(e) => e.key === "Enter" && setDimensions(2)}
          role="button"
          tabIndex={0}
        >
          2D
        </span>
        <ShadcnSwitch
          checked={is3D}
          onCheckedChange={(on) => setDimensions(on ? 3 : 2)}
        />
        <span
          className={cn(
            "text-xs font-medium cursor-pointer select-none",
            is3D && "text-[hsl(var(--sidebar-foreground))]",
            !is3D && "text-[hsl(var(--sidebar-muted-foreground))]"
          )}
          onClick={() => setDimensions(3)}
          onKeyDown={(e) => e.key === "Enter" && setDimensions(3)}
          role="button"
          tabIndex={0}
        >
          3D
        </span>
      </div>
    </SidebarGroup>
  );
}

const SELECT_DISABLED_CLASSES = cn(
  SELECT_CLASSES,
  "opacity-60 cursor-not-allowed"
);

function StrategySelect({
  strategy,
  setStrategy,
  options,
  disabled = false,
}: {
  strategy: ComputeStrategy;
  setStrategy: (s: ComputeStrategy) => void;
  options: { id: ComputeStrategy; label: string }[];
  disabled?: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Compute strategy</SidebarGroupLabel>
      <select
        value={strategy}
        onChange={(e) => setStrategy(e.target.value as ComputeStrategy)}
        className={disabled ? SELECT_DISABLED_CLASSES : SELECT_CLASSES}
        disabled={disabled}
      >
        {options.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </SidebarGroup>
  );
}

function GenerationDisplay({ counter }: { counter: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Generation</SidebarGroupLabel>
      <p className="text-base font-semibold tabular-nums leading-none">{counter}</p>
    </SidebarGroup>
  );
}

interface SimulationTogglesProps {
  animation: boolean;
  outline: boolean;
  setAnimation: (v: boolean) => void;
  setOutline: (v: boolean) => void;
}

function SimulationToggles({
  animation,
  outline,
  setAnimation,
  setOutline,
}: SimulationTogglesProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Simulation</SidebarGroupLabel>
      <div className="flex flex-col gap-1.5">
        <Switch title="Rotation" cb={setAnimation} state={animation} />
        <Switch title="Outline" cb={setOutline} state={outline} checked={true} />
      </div>
    </SidebarGroup>
  );
}

interface ActionButtonsProps {
  onGoing: boolean;
  onReset: () => void;
  setOnGoing: (v: boolean) => void;
  implementChangeState: () => Promise<void>;
}

function ActionButtons({
  onGoing,
  onReset,
  setOnGoing,
  implementChangeState,
}: ActionButtonsProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1">
          <Button
            variant={onGoing ? "secondary" : "default"}
            size="sm"
            onClick={() => setOnGoing(!onGoing)}
            className="flex-1 py-1.5 text-xs"
          >
            {onGoing ? "Pause" : "Play"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => implementChangeState()}
            className="flex-1 py-1.5 text-xs"
          >
            Next
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="w-full py-1.5 text-xs">
          Reset
        </Button>
      </div>
    </SidebarGroup>
  );
}

function MapRuleSelect({
  rulePreset,
  setRulePreset,
}: {
  rulePreset: MapRulePresetId;
  setRulePreset: (id: MapRulePresetId) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Rule</SidebarGroupLabel>
      <select
        value={rulePreset}
        onChange={(e) => setRulePreset(e.target.value as MapRulePresetId)}
        className={SELECT_CLASSES}
      >
        {MAP_RULE_PRESETS.map((p) => (
          <option key={p.id} value={p.id} title={p.description}>
            {p.label}
          </option>
        ))}
      </select>
    </SidebarGroup>
  );
}

interface GridSizeControlProps {
  n: number;
  onAdjustCubeCount: (value: number[]) => void;
}

function GridSizeControl({ n, onAdjustCubeCount }: GridSizeControlProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Grid size</SidebarGroupLabel>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={CONWAY_GRID_MIN}
            max={CONWAY_GRID_MAX}
            value={n}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v)) {
                const clamped = Math.min(
                  CONWAY_GRID_MAX,
                  Math.max(CONWAY_GRID_MIN, v)
                );
                onAdjustCubeCount([clamped]);
              }
            }}
            className={cn(
              "w-11 rounded border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] px-1.5 py-1 text-center text-xs font-medium tabular-nums text-[hsl(var(--sidebar-foreground))]",
              "focus:outline-none focus:ring-1 focus:ring-[hsl(var(--sidebar-primary))]"
            )}
          />
          <span className="text-[10px] text-muted-foreground">
            1–{CONWAY_GRID_MAX}
          </span>
        </div>
        <ShadcnSlider
          orientation="horizontal"
          min={CONWAY_GRID_MIN}
          max={CONWAY_GRID_MAX}
          step={1}
          value={[n]}
          onValueChange={onAdjustCubeCount}
          className="h-4 w-full"
        />
      </div>
    </SidebarGroup>
  );
}

export interface AppSidebarProps {
  ctx: ConwayLayoutContext;
  onAdjustCubeCount: (value: number[]) => void;
}

export function AppSidebar({ ctx, onAdjustCubeCount }: AppSidebarProps) {
  const { pathname } = useLocation();
  const versionPath = getCurrentVersionPath(pathname);
  const isV3 = versionPath === "/v3";

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="text-xs font-semibold tracking-tight text-[hsl(var(--sidebar-foreground))]">
          Conway
        </span>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-1 px-2">
        <VersionSelect />
        {isV3 && ctx.mapSim ? (
          <>
            <GenerationDisplay counter={ctx.mapSim.counter} />
            <MapRuleSelect
              rulePreset={ctx.mapSim.rulePreset}
              setRulePreset={ctx.mapSim.setRulePreset}
            />
            <ActionButtons
              onGoing={ctx.mapSim.onGoing}
              onReset={ctx.mapSim.onReset}
              setOnGoing={ctx.mapSim.setOnGoing}
              implementChangeState={() =>
                Promise.resolve(ctx.mapSim!.implementChangeState())
              }
            />
          </>
        ) : !isV3 ? (
          <>
            <GenerationDisplay counter={ctx.counter} />
            <DimensionsToggle
              dimensions={ctx.dimensions}
              setDimensions={ctx.setDimensions}
            />
            {(versionPath === "/v1" || versionPath === "/v2") && (
              <StrategySelect
                strategy={ctx.strategy}
                setStrategy={ctx.setStrategy}
                options={versionPath === "/v1" ? STRATEGIES_V1 : STRATEGIES_V2}
                disabled={versionPath === "/v1"}
              />
            )}
            <SimulationToggles
              animation={ctx.animation}
              outline={ctx.outline}
              setAnimation={ctx.setAnimation}
              setOutline={ctx.setOutline}
            />
            <ActionButtons
              onGoing={ctx.onGoing}
              onReset={ctx.onReset}
              setOnGoing={ctx.setOnGoing}
              implementChangeState={ctx.implementChangeState}
            />
            <GridSizeControl n={ctx.n} onAdjustCubeCount={onAdjustCubeCount} />
          </>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
}
