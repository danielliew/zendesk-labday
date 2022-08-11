import styles from "../styles/Button.module.sass"

export default function Button ({
  children,
  type,
  onClick,
  href
}) {
  const openWindow = () => {
    window.open(href, "_blank")
  }
  return <div className={`${styles.button} ${styles[type]}`} onClick={href ? openWindow : onClick}>
    {children}
  </div>
}