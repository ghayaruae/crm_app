import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import Select from 'react-select';

const SearchOEParts = () => {

    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const headers = apiHeaderJson

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [part_number, setPart_number] = useState("")
    const [brandOptions, setBrandOptions] = useState([])
    const [filtersApplied, setFiltersApplied] = useState(false)

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Reports/GetInventoryCrossParts`, {
                headers,
                params: {
                    page,
                    limit,
                    part_number,
                    SUP_ID: selectedBrand ?? null
                }
            })
            const { success, data, page: currentPage, next, prev, total_pages, total_records } = response.data
            if (success) {
                setData(data)
                setPage(currentPage)
                setNext(next)
                setPrev(prev)
                setTotalPages(total_pages)
                setTotalRecords(total_records)
            } else {
                setData([])
            }
        } catch (error) {
            console.error('Error getting data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getBrandsList = async () => {
        try {
            const response = await axios.get(`${apiURL}Reports/GetSupplierBrands`, { headers })
            const { success, data } = response.data
            if (success) {
                const options = data.map((item) => ({
                    value: item.SUP_ID,
                    label: item.SUP_BRAND
                }))
                setBrandOptions(options)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePrev = () => {
        if (prev) {
            setPage(p => p - 1)
            getData()
        }
    }

    const handleNext = () => {
        if (next) {
            setPage(p => p + 1)
            getData()
        }
    }

    const handleChange = (e) => {
        const newPage = parseInt(e.target.value, 10)
        setPage(newPage)
        getData()
    }

    const handleFilter = () => {
        if (part_number || selectedBrand) {
            setFiltersApplied(prev => !prev)
            setPage(1)
            getData()
        }
    }

    const handleReset = () => {
        if (part_number || selectedBrand) {
            setSelectedBrand(null)
            setPart_number("")
            setFiltersApplied(prev => !prev)
            setData([])
            setPage(1)
            setLimit(10)
            setTotalRecords(0)
            setTotalPages(0)
        }
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit)
        setPage(1)
        if (filtersApplied) {
            getData()
        }
    }

    useEffect(() => {
        getBrandsList()
    }, [])

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="OE Management" primary="Reports" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h5 className="mb-0 text-white">OE Parts List</h5>
                                    </div>

                                    <div className="card-body">
                                        <div className="row mb-4 g-3 align-items-center">
                                            <div className="col-md-3">
                                                <Select
                                                    name='selectedSalesman'
                                                    theme={selectTheme}
                                                    styles={selectStyle}
                                                    options={brandOptions}
                                                    value={brandOptions.find(opt => opt.value === selectedBrand) || null}
                                                    onChange={(selected) => setSelectedBrand(selected?.value)}
                                                    placeholder="Select Brand"
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <input
                                                    type="text"
                                                    name="part_number"
                                                    value={part_number}
                                                    onChange={(e) => setPart_number(e.target.value)}
                                                    className='form-control'
                                                    placeholder='Enter part number'
                                                />
                                            </div>

                                            <div className="col-md-3 d-flex gap-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-label right"
                                                    onClick={handleFilter}
                                                    disabled={!selectedBrand || !part_number}
                                                >
                                                    Filter
                                                    <i className="ri-filter-line label-icon align-middle fs-16 ms-2"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-light"
                                                    onClick={handleReset}
                                                    disabled={!selectedBrand || !part_number}
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>

                                        <div className="table-card table-responsive">
                                            <table className="table table-bordered table-striped table-hover table-nowrap mb-0">
                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>Part Number</th>
                                                        <th>ART Number</th>
                                                        <th>SUP ID</th>
                                                        <th>Brand Name</th>
                                                        <th>OE Type</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {filtersApplied ? (
                                                        loading ? (
                                                            <tr><td colSpan="8"><TableRows /></td></tr>
                                                        ) : data.length > 0 ? (
                                                            data.map((row) => (
                                                                <tr key={row.inventory_stock_oe_link_id} className="text-center">
                                                                    <td>{row.cross_part_number}</td>
                                                                    <td>{row.cross_part_art_number}</td>
                                                                    <td>{row.cross_part_sup_id}</td>
                                                                    <td>{row.cross_brand_name}</td>
                                                                    <td>{row.cross_type}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr><td colSpan="8"><NoRecords /></td></tr>
                                                        )
                                                    ) : (
                                                        <tr><td colSpan="8" className='text-center text-muted'>Apply filter to view records</td></tr>
                                                    )}
                                                </tbody>

                                                {filtersApplied && data.length > 0 && (
                                                    <tfoot className='table-light'>
                                                        <tr>
                                                            <th colSpan={8}>
                                                                <div className="d-flex justify-content-between">
                                                                    <button
                                                                        disabled={!prev || loading}
                                                                        type="button"
                                                                        onClick={handlePrev}
                                                                        className="btn btn-warning btn-label waves-effect waves-light"
                                                                    >
                                                                        <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous
                                                                    </button>

                                                                    <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <small>Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}</small>
                                                                    </div>

                                                                    <div className='col-md-2'>
                                                                        <select
                                                                            className="form-select"
                                                                            value={page}
                                                                            onChange={handleChange}
                                                                            disabled={loading}
                                                                        >
                                                                            {Array.from({ length: totalPages }, (_, i) => (
                                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className='col-md-2'>
                                                                        <GlobalLimitChanger
                                                                            placeholder="Set limit:"
                                                                            name="globalLimit"
                                                                            value={limit}
                                                                            onChange={handleLimitChange}
                                                                            showAllValue={totalRecords}
                                                                            disabled={loading}
                                                                        />
                                                                    </div>

                                                                    <button
                                                                        disabled={!next || loading}
                                                                        type="button"
                                                                        onClick={handleNext}
                                                                        className="btn btn-primary btn-label waves-effect right waves-light"
                                                                    >
                                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next
                                                                    </button>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchOEParts