const TableRows = (props) => {
  return (
    Array.from({ length: props.rows }, (_, i) => (
      <tr key={i} className="shimmer">
        <td colSpan={props.colspan} ><span style={{ visibility: 'hidden' }}>test</span></td>
      </tr>
    ))
  );

}

const NoRecords = (props) => {
  return (

    <div className="noresult" style={{ display: 'block', width: '100%' }}>
      <div className="text-center">
        <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#121331,secondary:#08a88a" style={{ width: '75px', height: '75px' }} />
        <h5 className="mt-2">Sorry! No Result Found</h5>
      </div>
    </div>
  );
}

const CardShimmer = ({ count }) => {
  if (count === 0) return null;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="col-md-4 col-sm-6 col-12"
        >
          <div
            className="card shadow-none shimmer"
            style={{
              height: "130px",
              border: `1px solid #2a326630`,
              borderLeft: `3px solid #2a3266`
            }}
          >
            <div className="card-body">
              <div className="d-flex flex-column align-items-start text-start">
                <div className="shimmer-box w-100"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};


const ContentLoader = (props) => {
  return (

    <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="spinner-border" style={{color:"#2a3266"}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
export { TableRows, NoRecords, ContentLoader, CardShimmer };