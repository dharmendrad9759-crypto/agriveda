/** Fixed cinematic stage behind admin console (CSS-driven motion). */
export function AdminAtmosphere() {
  return (
    <div className="admin-cine__stage" aria-hidden>
      <div className="admin-cine__field" />
      <div className="admin-cine__rays" />
      <div className="admin-cine__orb admin-cine__orb--a" />
      <div className="admin-cine__orb admin-cine__orb--b" />
      <div className="admin-cine__orb admin-cine__orb--c" />
      <div className="admin-cine__grain" />
      <div className="admin-cine__vignette" />
    </div>
  );
}
