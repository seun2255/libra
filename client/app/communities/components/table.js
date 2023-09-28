import styles from "./table.module.css";

const Table = ({ data }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>request</th>
            <th>reward</th>
            <th>Coin</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={styles.table__row}>
              <td>{item.request}</td>
              <td>{item.reward}</td>
              <td>{item.coin}</td>
              <td>Tommorow</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
