import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../../Context/ConfigContext';
import axios from 'axios';
import { NoRecords, TableRows } from '../../../../Components/Shimmer';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2"

const CustomerUsersList = ({ business_id }) => {

    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetBusinessUsersList = async () => {
        try {
            const headers = apiHeaderJson;

            const response = await axios.get(`${apiURL}Users/GetBusinessUsers`, { params: { business_id }, headers })

            const data = response?.data?.data;
            setData(data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (business_user_id) => {
        try {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: 'This user will be permanently deleted!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, delete it!',
            });

            if (!confirm.isConfirmed) return;

            const headers = apiHeaderJson;

            const response = await axios.delete(`${apiURL}Users/DeleteBusinessUser`, {
                params: { business_user_id },
                headers,
            });

            if (response?.data?.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: response.data.message || 'User deleted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                GetBusinessUsersList();
            } else {
                Swal.fire({
                    title: 'Failed!',
                    text: response?.data?.message || 'Something went wrong.',
                    icon: 'error',
                });
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred.',
                icon: 'error',
            });
        }
    };

    useEffect(() => {
        GetBusinessUsersList()
    }, [])

    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header border border-bottom align-items-center d-flex justify-content-between">
                        <h5 className='mb-0'>Business User List</h5>
                        <Link to={`/business/BusinessUsers/${business_id}`}>
                            <button
                                className='btn btn-primary btn-sm'>Add Business Users</button>
                        </Link>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className='table table-striped text-center'>
                                <thead>
                                    <tr>
                                        <th>Business Id</th>
                                        <th>Business User Name</th>
                                        <th>Business User Login Id</th>
                                        <th>Business User Login Password</th>
                                        <th>Business User Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <TableRows colspan={12} rows={10} />
                                            :
                                            data?.length > 0 ?
                                                data?.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td>{item?.business_id}</td>
                                                            <td>{item?.user_name}</td>
                                                            <td>{item?.login_id}</td>
                                                            <td>{item?.login_password}</td>
                                                            {
                                                                item?.is_active === 1
                                                                    || item?.is_active === "1"
                                                                    || item?.is_active === null
                                                                    || item?.is_active === undefined
                                                                    ?
                                                                    <td>
                                                                        <span className='badge bg-success'>Active</span>
                                                                    </td>
                                                                    :
                                                                    <td>
                                                                        <span className='badge bg-danger'>In Active</span>
                                                                    </td>
                                                            }
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <div className="d-flex gap-2">
                                                                        <Link to={`/business/BusinessUsers/${business_id}/${item?.business_user_id}`}>
                                                                            <button className="btn btn-primary btn-sm">
                                                                                <i className="ri-pencil-fill" />
                                                                            </button>
                                                                        </Link>

                                                                        <button className="btn btn-danger btn-sm"
                                                                            onClick={() => handleDelete(item?.business_user_id)}
                                                                        >
                                                                            <i className="ri-delete-bin-fill" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td colspan={12}>
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
        </div >
    )
}

export default CustomerUsersList
