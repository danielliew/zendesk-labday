import { useCallback, useEffect, useState } from "react";

export default function useApi({
  path = "",
  initialData = {},
  triggerImmediately = true,
  method = "GET",
  options = {},
}) {
  const [state, setState] = useState({
    data: initialData,
    loading: false,
    error: false,
  });

  const setData = (d) => {
    setState((s) => ({ data: d }));
  };

  const trigger = useCallback((body) => {
    setState((s) => ({ ...s, loading: true }));
    fetch(path, {
      method,
      ...options,
      body
    })
      .then((value) => value.json())
      .then((data) => setState((s) => ({ ...s, data })))
      .catch((e) => setState((s) => ({ ...s, error: e.message })))
      .finally(() => setState((s) => ({ ...s, loading: false })));
  }, [path, method, options]);

  useEffect(() => {
    if (triggerImmediately) {
      trigger();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerImmediately]);

  return { ...state, setData, trigger };
}
