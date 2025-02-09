import { useSiteStore } from "../../Store";

import styles from "./LoadingScreen.module.css";

export const LoadingScreen = () => {
  const { isLoading } = useSiteStore();
  return (
    <div className={`${styles.container} ${isLoading ? styles.active : ""}`}>
      <div className={styles.loader}></div>
    </div>
  );
};
