import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { NoRecords, TableRows } from '../../Shimmer';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2"
import { ConfigContext } from '../../../Context/ConfigContext';

const CustomerDocumentUploads = ({ business_id }) => {

    const { apiURL, apiHeaderJson, apiHeaderFile, business_admin_user_id } = useContext(ConfigContext);
    const [documentData, setDocumentData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);


    const GetDocumentData = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Business/GetBusinessDocuments`, {
                params: { business_id }, headers
            })

            if (response?.data?.success) {
                const data = response?.data?.data
                setDocumentData(data)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoadingList(false);
        }
    }


    useEffect(() => {
        GetDocumentData()
    }, [business_id])

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card">

                    <div className="card-header d-flex justify-content-end align-items-center">
                        <h5 className="card-title flex-grow-1">Documents</h5>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table table-borderless align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">File Name</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">View Document</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                loadingList ?
                                                    <TableRows colspan={12} rows={10} />
                                                    :
                                                    documentData?.length > 0 ?
                                                        documentData?.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="avatar-sm">
                                                                                <div className="avatar-title bg-primary-subtle text-primary rounded fs-20">
                                                                                    <i className="ri-file-zip-fill" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="ms-3 flex-grow-1">
                                                                                <h6 className="fs-15 mb-0"><a href="javascript:void(0)">{item?.document_name}</a>
                                                                                </h6>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>{item?.document_path?.split('.').pop().toUpperCase()} File</td>
                                                                    <td>
                                                                        <Link to={item?.business_document_url} target="_blank" rel="noopener noreferrer">
                                                                            {item?.document_path}
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr>
                                                            <td colspan={8}>
                                                                <NoRecords />
                                                            </td>
                                                        </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CustomerDocumentUploads
