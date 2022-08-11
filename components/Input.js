import styles from "../styles/Input.module.sass";

export default function Input({ multiline, label, name, setState }) {
  const onChange = (e) => {
    setState((s) => ({ ...s, [name]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      {label && <p className={styles.label}>{label}</p>}
      {multiline ? (
        <textarea className={styles.input} onChange={onChange} />
      ) : (
        <input className={styles.input} onChange={onChange} />
      )}
    </div>
  );
}
