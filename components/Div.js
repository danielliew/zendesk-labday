export default function Div({
  children,
  loading,
  error,
  data,
  loadingChild,
  errorChild,
}) {
  if (loading) return loadingChild || "loading";

  if (error) return (errorChild && errorChild(error)) || error;

  return children(data);
}
