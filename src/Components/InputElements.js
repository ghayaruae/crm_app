const TextBox = (props) => {
  return (
    <div>
      <label htmlFor={`${props.id}`} className="form-label">{props.label}</label>
      <input className="form-control" value={props.value} type={props.type} id={props.id} name={props.name} placeholder={props.hint} onChange={props.change} />
    </div>
  );
}

const TextArea = (props) => {

  return (
    <div>
      <label htmlFor="basiInput" className="form-label">{props.label}</label>
      <textarea className="form-control" value={props.value} type={props.type} id={props.id} name={props.name} placeholder={props.hint} onChange={props.change} />
    </div>
  );
}
const SubmitBtn = (props) => {
  return (
    props.status === true ? (
      <button
        type="button"
        className={`btn btn-${props.type} btn-load`}
        onClick={props.onClick}
      >
        <span className="d-flex align-items-center">
          <span className="flex-grow-1 me-2">Please wait...</span>
          <span className="spinner-grow flex-shrink-0" role="status">
            <span className="visually-hidden">Please wait...</span>
          </span>
        </span>
      </button>
    ) : (
      <button
        type="submit"
        disabled={props.disabled}
        className={`btn btn-${props.type} btn-label waves-effect right waves-light float-right`}
        onClick={props.onClick}
      >
        <i className={`${props.icon} label-icon align-middle fs-16 ms-2`} />
        {props.text}
      </button>
    )
  );
};

const IsRequired = () => {
  return (
    <span style={{ color: 'blue', marginLeft: 5, borderRadius: '50%', background: 'rgb(240, 248, 255)', textAlign: 'center', width: 20, height: 20, padding: '0px 5px' }}>*</span>
  );
}

const GlobalLimitChanger = ({
  placeholder = "Select a limit...",
  name,
  is_show_all = false,
  value,
  onChange,
  showAllValue,
}) => {
  const handleSelectChange = (e) => {
    const newValue = e.target.value === "showAll" ? showAllValue : parseInt(e.target.value, 10);
    onChange(newValue);
  };

  return (
    <div>
      <select
        id={name}
        value={value === showAllValue ? "showAll" : value}
        onChange={handleSelectChange}
        className="form-select">
        <option value="10">Limit 10</option>
        <option value="25">Limit 25</option>
        <option value="100">Limit 100</option>
        <option value="1000">Limit 1000</option>
        <option className={is_show_all ? "" : 'd-none'} value="showAll">Show All</option>
      </select>
    </div>
  );
};

export { TextBox, TextArea, SubmitBtn, IsRequired, GlobalLimitChanger };