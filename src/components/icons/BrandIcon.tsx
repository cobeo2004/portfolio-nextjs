import {
  siAnthropic,
  siClickup,
  siDocker,
  siElevenlabs,
  siFastapi,
  siGo,
  siGoogleads,
  siGoogleanalytics,
  siGooglecalendar,
  siGooglegemini,
  siGooglesearchconsole,
  siKubernetes,
  siMeta,
  siNextdotjs,
  siOnnx,
  siOpenai,
  siPostgresql,
  siPython,
  siRedis,
  siRust,
  siSupabase,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

const brandIcons = {
  anthropic: siAnthropic,
  clickup: siClickup,
  docker: siDocker,
  elevenlabs: siElevenlabs,
  fastapi: siFastapi,
  go: siGo,
  googleads: siGoogleads,
  googleanalytics: siGoogleanalytics,
  googlecalendar: siGooglecalendar,
  googlegemini: siGooglegemini,
  googlesearchconsole: siGooglesearchconsole,
  kubernetes: siKubernetes,
  meta: siMeta,
  nextdotjs: siNextdotjs,
  onnx: siOnnx,
  openai: siOpenai,
  postgresql: siPostgresql,
  python: siPython,
  redis: siRedis,
  rust: siRust,
  supabase: siSupabase,
  typescript: siTypescript,
} satisfies Record<string, SimpleIcon>;

export type TBrandIconName = keyof typeof brandIcons;

export const brandTitle = (name: TBrandIconName) =>
  ({ postgresql: "Postgres", googlegemini: "Gemini", nextdotjs: "Next.js" })[
    name as string
  ] ?? brandIcons[name].title;

export default function BrandIcon({ name }: { name: TBrandIconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={brandIcons[name].path} />
    </svg>
  );
}
