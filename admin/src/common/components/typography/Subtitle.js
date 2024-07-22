function Subtitle({ styleClass, children, color }) {
  return (
    <div className={`text-xl font-semibold ${styleClass}`} style={{ color: color }}>
      {children}
    </div>
  );
}

export default Subtitle;
