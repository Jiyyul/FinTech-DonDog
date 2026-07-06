import type { Chart, TooltipModel } from "chart.js";
import { CHART_UI } from "@/lib/chart-colors";

const TOOLTIP_CLASS = "dondok-chart-tooltip";

function getOrCreateTooltip(chart: Chart): HTMLDivElement {
  const parent = chart.canvas.parentNode as HTMLElement;
  parent.style.position = "relative";

  let tooltipEl = parent.querySelector<HTMLDivElement>(`.${TOOLTIP_CLASS}`);
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = TOOLTIP_CLASS;
    tooltipEl.setAttribute("role", "tooltip");
    parent.appendChild(tooltipEl);
  }

  return tooltipEl;
}

function applyTooltipStyles(tooltipEl: HTMLDivElement) {
  Object.assign(tooltipEl.style, {
    position: "absolute",
    zIndex: "100",
    pointerEvents: "none",
    opacity: "0",
    background: CHART_UI.tooltipBg,
    border: `1px solid ${CHART_UI.border}`,
    borderRadius: "16px",
    padding: "14px",
    boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
    transition: "opacity 0.15s ease, top 0.1s ease, left 0.1s ease",
    minWidth: "0",
    maxWidth: "240px",
  });
}

function buildTooltipHtml(tooltip: TooltipModel<"line" | "doughnut">): string {
  const title = tooltip.title?.length
    ? `<div style="color:${CHART_UI.navy};font-size:13px;font-weight:600;margin-bottom:6px;letter-spacing:-0.02em;">${tooltip.title.join(" ")}</div>`
    : "";

  const body = tooltip.body
    .map((item, i) => {
      const colors = tooltip.labelColors[i];
      const swatch = colors
        ? `<span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${colors.backgroundColor};margin-right:8px;flex-shrink:0;"></span>`
        : "";

      return `<div style="display:flex;align-items:flex-start;color:${CHART_UI.muted};font-size:12px;line-height:1.45;margin-top:${i === 0 ? "0" : "4px"};">${swatch}<span>${item.lines.join("<br/>")}</span></div>`;
    })
    .join("");

  const afterBody =
    tooltip.afterBody?.length && tooltip.afterBody.some((line) => line.length > 0)
      ? tooltip.afterBody
          .map(
            (line) =>
              `<div style="color:${CHART_UI.muted};font-size:12px;line-height:1.45;margin-top:4px;">${line}</div>`
          )
          .join("")
      : "";

  return `${title}${body}${afterBody}`;
}

function positionTooltip(
  chart: Chart,
  tooltip: TooltipModel<"line" | "doughnut">,
  tooltipEl: HTMLDivElement
) {
  const { offsetLeft, offsetTop } = chart.canvas;
  const gap = 14;

  let translateX = "-50%";
  let translateY = "-100%";
  let left = offsetLeft + tooltip.caretX;
  let top = offsetTop + tooltip.caretY - gap;

  if (tooltip.xAlign === "left") {
    translateX = "0";
  } else if (tooltip.xAlign === "right") {
    translateX = "-100%";
  }

  if (tooltip.yAlign === "top") {
    translateY = `${gap}px`;
    top = offsetTop + tooltip.caretY + gap;
  } else if (tooltip.yAlign === "center") {
    translateY = "-50%";
    top = offsetTop + tooltip.caretY;
  }

  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.transform = `translate(${translateX}, ${translateY})`;
}

/** HTML tooltip — always stacks above chart canvas and center overlays. */
export function externalChartTooltip(context: {
  chart: Chart;
  tooltip: TooltipModel<"line" | "doughnut">;
}) {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  applyTooltipStyles(tooltipEl);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  tooltipEl.innerHTML = buildTooltipHtml(tooltip);
  positionTooltip(chart, tooltip, tooltipEl);
  tooltipEl.style.opacity = "1";
}

export const CHART_TOOLTIP_BASE = {
  enabled: false,
  external: externalChartTooltip,
  position: "nearest" as const,
  yAlign: "bottom" as const,
  xAlign: "center" as const,
  backgroundColor: CHART_UI.tooltipBg,
  titleColor: CHART_UI.navy,
  bodyColor: CHART_UI.muted,
  borderColor: CHART_UI.border,
  borderWidth: 1,
  padding: 14,
  cornerRadius: 16,
  boxPadding: 8,
  displayColors: true,
  caretPadding: 10,
  caretSize: 0,
};
