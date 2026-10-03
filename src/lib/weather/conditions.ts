/** Map WMO weather interpretation codes (Open-Meteo) to Harbor Desk UI. */

export type WeatherIconId = "sun" | "moon" | "cloud" | "cloud-sun" | "rain" | "dusk";

export function conditionFromWmo(code: number, isDay: boolean): {
  condition: string;
  icon: WeatherIconId;
} {
  if (code === 0) {
    return {
      condition: isDay ? "Clear" : "Clear night",
      icon: isDay ? "sun" : "moon",
    };
  }
  if (code === 1) {
    return {
      condition: isDay ? "Mainly clear" : "Mostly clear",
      icon: isDay ? "sun" : "moon",
    };
  }
  if (code === 2) {
    return {
      condition: "Partly cloudy",
      icon: isDay ? "cloud-sun" : "cloud",
    };
  }
  if (code === 3) {
    return { condition: "Overcast", icon: "cloud" };
  }
  if (code === 45 || code === 48) {
    return { condition: "Fog", icon: "cloud" };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { condition: "Drizzle", icon: "rain" };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { condition: "Rain", icon: "rain" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: "Snow", icon: "cloud" };
  }
  if (code === 95 || code === 96 || code === 99) {
    return { condition: "Thunderstorm", icon: "rain" };
  }
  return { condition: "Cloudy", icon: "cloud" };
}
