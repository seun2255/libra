import styles from "./table.module.css";

const Table = ({ data }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Coin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>{item.amount}</td>
              <td>{item.coin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
