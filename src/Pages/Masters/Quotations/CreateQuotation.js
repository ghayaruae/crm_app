import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { SubmitBtn } from '../../../Components/InputElements'
import { ConfigContext } from '../../../Context/ConfigContext'
import PageTitle from '../../../Components/PageTitle'
import Swal from 'sweetalert2'
import Flatpickr from "react-flatpickr";
import { Link, useNavigate, useParams } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

const CreateQuotation = () => {

    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const { quotation_id } = useParams()
    const navigate = useNavigate()
    const headers = apiHeaderJson;

    // Form State
    const [formData, setFormData] = useState({
        quotation_number: '',
        customer_name: '',
        customer_email: '',
        customer_contact: '',
        customer_address: '',
        issue_date: '',
        expiry_date: '',
        remark: '',
        payment_condition: '',
    })
    const [customer_type, setCustomerType] = useState(0)
    const [stock_type, setStockType] = useState(0) // 0: AFM, 1: OE

    // Items State
    const [itemsData, setItemsData] = useState([])

    // Select Mode State
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [brandsOptions, setBrandsOptions] = useState([])
    const [itemNumber, setItemNumber] = useState('')
    const [selectItemFields, setSelectItemFields] = useState({
        item_name: '',
        item_qty: '',
        item_price: '',
        item_vat: '5',
        item_total: ''
    })

    // Manual Mode State
    const [manualMode, setManualMode] = useState(false)
    const [manualItem, setManualItem] = useState({
        item_number: '',
        item_name: '',
        item_brand_name: '',
        item_qty: '',
        item_price: '',
        item_vat: '5',
        item_total: ''
    })

    // Customer Suggestion State
    const [customerOptions, setCustomerOptions] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Validation States
    const [errors, setErrors] = useState({})
    const [itemErrors, setItemErrors] = useState({})
    const [submitLoading, setSubmitLoading] = useState(false)

    // Generate quotation number on component mount
    useEffect(() => {
        if (!quotation_id) {
            generateQuotationNumber()
        }
    }, [])

    // Fetch customers for suggestion
    useEffect(() => {
        fetchCustomers()
    }, [])

    // Fetch brands based on stock type
    useEffect(() => {
        if (stock_type === 0) {
            GetAFMBrands()
        } else {
            GetOEBrands()
        }
    }, [stock_type])

    // Fetch quotation data if editing
    useEffect(() => {
        if (quotation_id) {
            fetchQuotationData()
        }
    }, [quotation_id])

    // Calculate total for manual mode
    useEffect(() => {
        const { item_qty, item_price, item_vat } = manualItem
        if (item_qty && item_price && item_vat) {
            const total = calculateItemTotal(item_qty, item_price, item_vat)
            setManualItem(prev => ({ ...prev, item_total: total }))
        } else {
            setManualItem(prev => ({ ...prev, item_total: '' }))
        }
    }, [manualItem.item_qty, manualItem.item_price, manualItem.item_vat])

    // Calculate total for select mode
    useEffect(() => {
        const { item_qty, item_price, item_vat } = selectItemFields
        if (item_qty && item_price && item_vat) {
            const total = calculateItemTotal(item_qty, item_price, item_vat)
            setSelectItemFields(prev => ({ ...prev, item_total: total }))
        } else {
            setSelectItemFields(prev => ({ ...prev, item_total: '' }))
        }
    }, [selectItemFields.item_qty, selectItemFields.item_price, selectItemFields.item_vat])

    useEffect(() => {
        if (selectedBrand && itemNumber?.trim()) {
            GetItemInfo()
        }
    }, [selectedBrand, itemNumber, customer_type])

    const generateQuotationNumber = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetLastQuotationNumber`, { headers })
            const { success, last_number } = response.data;
            if (success) {
                const nextNumber =
                    (parseInt(last_number) + 1)
                        .toString()
                        .padStart(4, '0');
                setFormData(prev => ({ ...prev, quotation_number: nextNumber }))
            } else {
                // Default starting number
                setFormData(prev => ({ ...prev, quotation_number: '0001' }))
            }
        } catch (error) {
            console.log(error)
            // Default starting number if API fails
            setFormData(prev => ({ ...prev, quotation_number: '0001' }))
        }
    }

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${apiURL}Business/GetAllBusinessesList`, { headers })
            const { success, data } = response.data;
            if (success && data) {
                const options = data.map((customer) => ({
                    value: customer.business_id,
                    label: customer.business_name,
                    email: customer.business_email,
                    contact: customer.business_contact_number,
                    address: customer.business_full_address,
                    ...customer
                }));
                setCustomerOptions(options)
            }
        } catch (error) {
            console.log("Error fetching customers:", error)
        }
    }

    const handleCustomerChange = (option) => {
        setSelectedCustomer(option);

        if (!option) {
            setFormData(prev => ({
                ...prev,
                customer_name: '',
                customer_email: '',
                customer_contact: '',
                customer_address: ''
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            customer_name: option.label || '',
            customer_email: option.email || '',
            customer_contact: option.contact || '',
            customer_address: option.address || ''
        }));

        setErrors({});
    };

    const GetAFMBrands = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetSuppliersBrandList`, { headers })
            const { success, data } = response.data;
            if (success) {
                const options = data.map((item) => ({
                    value: item.SUP_ID,
                    label: item.SUP_BRAND,
                    ...item
                }));
                setBrandsOptions(options)
            }
        } catch (error) {
            console.log(error)
            Swal.fire("Error", "Failed to fetch AFM brands", "error")
        }
    }

    const GetOEBrands = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetOEBrandList`, { headers })
            const { success, data } = response.data;
            if (success) {
                const options = data.map((item) => ({
                    value: item.MFA_ID,
                    label: item.stock_brand_name,
                    ...item
                }));
                setBrandsOptions(options)
            }
        } catch (error) {
            console.log(error)
            Swal.fire("Error", "Failed to fetch OE brands", "error")
        }
    }

    const GetItemInfo = async () => {
        if (!selectedBrand || !itemNumber) {
            return
        }

        try {
            const params = {
                part_number: itemNumber.trim(),
                stock_type,
                sup_id: selectedBrand?.SUP_ID || '',
                brand_name: selectedBrand?.stock_brand_name || ''
            }

            const response = await axios.get(`${apiURL}Masters/GetPartInfo`, { headers, params })
            const { success, data } = response.data

            if (success && data) {
                const itemData = data
                const price = getPrice(itemData)

                setSelectItemFields(prev => ({
                    ...prev,
                    item_name: itemData.PRODUCT_GROUP_EN,
                    item_price: price.toString(),
                    item_vat: '5'
                }))

                // Clear any previous errors
                if (itemErrors.item_number) {
                    setItemErrors(prev => ({ ...prev, item_number: '' }))
                }
            } else {
                Swal.fire("Info", "No item found for the selected criteria", "info")
                setSelectItemFields(prev => ({
                    ...prev,
                    item_name: "",
                    item_qty: '',
                    item_price: '',
                    item_vat: '5'
                }))
            }
        } catch (error) {
            console.log(error)
            Swal.fire("Error", "Failed to fetch item information", "error")
        }
    }

    const fetchQuotationData = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetQuotationInfo`, { headers, params: { quotation_id } }
            )
            if (response.data.success) {
                const {
                    quotation_number, customer_name, customer_email, customer_contact,
                    customer_address, issue_date, expiry_date, remark, payment_condition, items
                } = response.data.data

                setFormData({
                    quotation_number: quotation_number || '',
                    customer_name: customer_name || '',
                    customer_email: customer_email || '',
                    customer_contact: customer_contact || '',
                    customer_address: customer_address || '',
                    issue_date: issue_date || '',
                    expiry_date: expiry_date || '',
                    remark: remark || '',
                    payment_condition: payment_condition || '',
                })
                setItemsData(items || [])
            }
        } catch (error) {
            console.error("Error fetching quotation:", error)
            Swal.fire("Error", "Failed to fetch quotation data", "error")
        }
    }

    const calculateItemTotal = (qty, price, vat) => {
        const quantity = parseFloat(qty) || 0
        const unitPrice = parseFloat(price) || 0
        const vatPercent = parseFloat(vat) || 0
        const subtotal = quantity * unitPrice
        const vatAmount = subtotal * (vatPercent / 100)
        return (subtotal + vatAmount).toFixed(2)
    }

    const validateForm = () => {
        const Errors = {}
        if (!formData.quotation_number) Errors.quotation_number = "Quotation Number is required"
        if (!formData.customer_name) Errors.customer_name = "Customer Name is required"
        if (!formData.customer_email) Errors.customer_email = "Customer Email is required"
        if (!formData.customer_contact) Errors.customer_contact = "Customer Contact is required"
        if (!formData.issue_date) Errors.issue_date = "Issue Date is required"
        if (!formData.expiry_date) Errors.expiry_date = "Expiry Date is required"

        // Email validation
        if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            Errors.customer_email = "Invalid email format"
        }

        // Phone validation
        if (formData.customer_contact && !/^[0-9]{10,15}$/.test(formData.customer_contact)) {
            Errors.customer_contact = "Invalid contact number"
        }

        setErrors(Errors)
        return Object.keys(Errors).length === 0
    }

    const validateItem = () => {
        const Errors = {}

        if (manualMode) {
            if (!manualItem.item_number) Errors.item_number = "Item Number is required"
            if (!manualItem.item_name) Errors.item_name = "Item Name is required"
            if (!manualItem.item_qty) Errors.item_qty = "Quantity is required"
            else if (parseFloat(manualItem.item_qty) <= 0) Errors.item_qty = "Quantity must be greater than 0"

            if (!manualItem.item_price) Errors.item_price = "Price is required"
            else if (parseFloat(manualItem.item_price) <= 0) Errors.item_price = "Price must be greater than 0"

            if (!manualItem.item_vat) Errors.item_vat = "VAT is required"
            else if (parseFloat(manualItem.item_vat) < 0) Errors.item_vat = "VAT cannot be negative"

            // Brand is optional in manual mode, so no validation for selectedBrand
        } else {
            if (!selectedBrand) Errors.selectedBrand = "Please select a brand"
            if (!itemNumber) Errors.item_number = "Item Number is required"
            if (!selectItemFields.item_name) Errors.item_name = "Item Name is required"
            if (!selectItemFields.item_qty) Errors.item_qty = "Quantity is required"
            else if (parseFloat(selectItemFields.item_qty) <= 0) Errors.item_qty = "Quantity must be greater than 0"

            if (!selectItemFields.item_price) Errors.item_price = "Price is required"
            else if (parseFloat(selectItemFields.item_price) <= 0) Errors.item_price = "Price must be greater than 0"

            if (!selectItemFields.item_vat) Errors.item_vat = "VAT is required"
            else if (parseFloat(selectItemFields.item_vat) < 0) Errors.item_vat = "VAT cannot be negative"
        }

        setItemErrors(Errors)
        return Object.keys(Errors).length === 0
    }

    const handleManualItemChange = (e) => {
        const { name, value } = e.target
        setManualItem(prev => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (itemErrors[name]) {
            setItemErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSelectFieldChange = (field, value) => {
        setSelectItemFields(prev => ({ ...prev, [field]: value }))
        // Clear error for this field
        if (itemErrors[field]) {
            setItemErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleAddItem = () => {
        if (!validateItem()) return;

        let newItem;

        if (manualMode) {
            newItem = {
                item_number: manualItem.item_number,
                item_name: manualItem.item_name,
                item_brand_name: selectedBrand?.label || 'N/A',
                item_qty: manualItem.item_qty,
                item_price: manualItem.item_price,
                item_vat: manualItem.item_vat,
                item_total: calculateItemTotal(
                    manualItem.item_qty,
                    manualItem.item_price,
                    manualItem.item_vat
                )
            };
        } else {
            newItem = {
                item_number: itemNumber,
                item_name: selectItemFields.item_name,
                item_brand_name: selectedBrand?.label,
                item_qty: selectItemFields.item_qty,
                item_price: selectItemFields.item_price,
                item_vat: selectItemFields.item_vat,
                item_total: calculateItemTotal(
                    selectItemFields.item_qty,
                    selectItemFields.item_price,
                    selectItemFields.item_vat
                )
            };
        }

        // Duplicate validation
        const duplicateItem = itemsData.find(
            item =>
                item.item_number?.trim().toLowerCase() ===
                newItem.item_number?.trim().toLowerCase()
        );

        if (duplicateItem) {
            Swal.fire(
                "Warning",
                `Item "${newItem.item_number}" already added`,
                "warning"
            );
            return;
        }

        setItemsData(prev => [...prev, newItem]);

        resetItemForm();

        Swal.fire(
            "Success",
            "Item added successfully",
            "success"
        );
    };

    const resetForm = () => {
        setFormData({
            quotation_number: '',
            customer_name: '',
            customer_email: '',
            customer_contact: '',
            customer_address: '',
            issue_date: '',
            expiry_date: '',
            remark: '',
            payment_condition: '',
        });

        setCustomerType(0);
        setStockType(0);

        setItemsData([]);

        setSelectedBrand(null);
        setBrandsOptions([]);

        setItemNumber('');

        setSelectItemFields({
            item_name: '',
            item_qty: '',
            item_price: '',
            item_vat: '5',
            item_total: ''
        });

        setManualMode(false);

        setManualItem({
            item_number: '',
            item_name: '',
            item_brand_name: '',
            item_qty: '',
            item_price: '',
            item_vat: '5',
            item_total: ''
        });

        setSelectedCustomer(null);

        setErrors({});
        setItemErrors({});
        setSubmitLoading(false);

        // Regenerate quotation number
        generateQuotationNumber();
    };

    const resetItemForm = () => {
        // Reset manual mode form
        setManualItem({
            item_number: '',
            item_name: '',
            item_brand_name: '',
            item_qty: '',
            item_price: '',
            item_vat: '5',
            item_total: ''
        })

        // Reset select mode form
        setSelectedBrand(null)
        setItemNumber('')
        setSelectItemFields({
            item_name: '',
            item_qty: '',
            item_price: '',
            item_vat: '5',
            item_total: ''
        })

        // Clear errors
        setItemErrors({})
    }

    const handleRemoveItem = (index) => {
        const updatedItems =
            itemsData.filter((_, i) => i !== index)

        setItemsData(updatedItems)

        Swal.fire(
            "Success",
            "Item removed",
            "success"
        )
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            Swal.fire("Error", "Please fill all required fields correctly", "error")
            return
        }

        if (itemsData.length === 0) {
            Swal.fire("Error", "Please add at least one item", "error")
            return
        }

        setSubmitLoading(true)

        const submitData = {
            ...formData,
            items: itemsData
        }

        if (quotation_id) submitData.quotation_id = quotation_id

        try {
            const response = await axios.post(`${apiURL}Masters/CreateQuotation`, submitData, { headers })
            if (response.data.success) {
                Swal.fire("Success", response.data.message, "success")
                if (quotation_id) {
                    navigate('/Masters/QuotationsList')
                } else {
                    resetForm()
                }
            }
        } catch (error) {
            console.error("Error submitting:", error)
            Swal.fire("Error", error.response?.data?.message || "Failed to submit quotation", "error")
        } finally {
            setSubmitLoading(false)
        }
    }

    const getPrice = (item) => {
        if (customer_type === 0) { // B2B
            return item.stock_bb_price || item.bb_price || 0
        }
        if (customer_type === 1) { // B2G
            return item.stock_bg_price || item.bg_price || 0
        }
        if (customer_type === 2) { // B2C
            return item.stock_bc_price || item.bc_price || 0
        }
        return 0;
    }

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Manage Quotations" primary="Masters" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="mb-0 flex-grow-1 text-white">
                                            {quotation_id ? 'Edit Quotation' : 'Create Quotation'}
                                        </h4>
                                        <Link to={"/Masters/QuotationsList"}>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle"
                                                title="View Quotations"
                                            >
                                                <i className="ri-list-unordered"></i>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="row g-3">
                                            {/* Quotation Number */}
                                            <div className="col-md-3">
                                                <label className="form-label">
                                                    Quotation Number <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.quotation_number ? 'is-invalid' : ''}`}
                                                    placeholder="Enter quotation number"
                                                    value={formData.quotation_number}
                                                    readOnly
                                                    disabled={quotation_id ? false : true}
                                                    style={{ backgroundColor: '#e9ecef' }}
                                                />
                                                {errors.quotation_number && <div className="invalid-feedback">{errors.quotation_number}</div>}
                                            </div>

                                            {/* Customer Name with Suggestion */}
                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Customer Name <span className="text-danger">*</span>
                                                </label>
                                                <CreatableSelect
                                                    value={selectedCustomer}
                                                    options={customerOptions}
                                                    onChange={handleCustomerChange}
                                                    placeholder="Search or add customer"
                                                    isClearable
                                                    theme={selectTheme}
                                                    styles={selectStyle}

                                                    onCreateOption={(input) => {

                                                        const newCustomer = {
                                                            value: input,
                                                            label: input,
                                                            email: '',
                                                            contact: '',
                                                            address: ''
                                                        };

                                                        setCustomerOptions(prev => [...prev, newCustomer]);

                                                        setSelectedCustomer(newCustomer);

                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customer_name: input,
                                                            customer_email: '',
                                                            customer_contact: '',
                                                            customer_address: ''
                                                        }));
                                                    }}
                                                />
                                                {errors.customer_name && <div className="text-danger small mt-1">{errors.customer_name}</div>}
                                            </div>

                                            {/* Customer Email */}
                                            <div className="col-md-3">
                                                <label className="form-label">
                                                    Customer Email <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.customer_email ? 'is-invalid' : ''}`}
                                                    placeholder="customer@example.com"
                                                    name="customer_email"
                                                    value={formData.customer_email}
                                                    onChange={(e) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customer_email: e.target.value
                                                        }))
                                                    }
                                                />
                                                {errors.customer_email && <div className="invalid-feedback">{errors.customer_email}</div>}
                                            </div>

                                            <div className="col-md-2">
                                                <label className='form-label'>Customer Type</label>
                                                <div className="d-flex gap-3">
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="customer_type"
                                                            id="b2b"
                                                            value={0}
                                                            checked={customer_type === 0}
                                                            onChange={() => setCustomerType(0)}
                                                        />
                                                        <label htmlFor="b2b" className="ms-1">B2B</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="customer_type"
                                                            id="b2g"
                                                            value={1}
                                                            checked={customer_type === 1}
                                                            onChange={() => setCustomerType(1)}
                                                        />
                                                        <label htmlFor="b2g" className="ms-1">B2G</label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="radio"
                                                            name="customer_type"
                                                            id="b2c"
                                                            value={2}
                                                            checked={customer_type === 2}
                                                            onChange={() => setCustomerType(2)}
                                                        />
                                                        <label htmlFor="b2c" className="ms-1">B2C</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Contact */}
                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Customer Contact <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    className={`form-control ${errors.customer_contact ? 'is-invalid' : ''}`}
                                                    placeholder="1234567890"
                                                    name="customer_contact"
                                                    value={formData.customer_contact}
                                                    onChange={(e) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customer_contact: e.target.value
                                                        }))
                                                    }
                                                />
                                                {errors.customer_contact && <div className="invalid-feedback">{errors.customer_contact}</div>}
                                            </div>

                                            {/* Issue Date */}
                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Issue Date <span className="text-danger">*</span>
                                                </label>
                                                <Flatpickr
                                                    className={`form-control ${errors.issue_date ? 'is-invalid' : ''}`}
                                                    value={formData.issue_date}
                                                    placeholder="Select issue date"
                                                    onChange={(selectedDates, dateStr) => setFormData({ ...formData, issue_date: dateStr })}
                                                    options={{ dateFormat: "Y-m-d", maxDate: "today" }}
                                                />
                                                {errors.issue_date && <div className="invalid-feedback">{errors.issue_date}</div>}
                                            </div>

                                            {/* Expiry Date */}
                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Expiry Date <span className="text-danger">*</span>
                                                </label>
                                                <Flatpickr
                                                    className={`form-control ${errors.expiry_date ? 'is-invalid' : ''}`}
                                                    value={formData.expiry_date}
                                                    placeholder="Select expiry date"
                                                    onChange={(selectedDates, dateStr) => setFormData({ ...formData, expiry_date: dateStr })}
                                                    options={{ dateFormat: "Y-m-d", minDate: formData.issue_date || "today" }}
                                                />
                                                {errors.expiry_date && <div className="invalid-feedback">{errors.expiry_date}</div>}
                                            </div>

                                            {/* Payment Condition */}
                                            <div className="col-md-4">
                                                <label className="form-label">Payment Condition</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Enter payment condition"
                                                    value={formData.payment_condition}
                                                    onChange={(e) => setFormData({ ...formData, payment_condition: e.target.value })}
                                                />
                                            </div>

                                            {/* Customer Address */}
                                            <div className="col-md-4">
                                                <label className="form-label">Customer Address</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Enter customer address"
                                                    name="customer_address"
                                                    value={formData.customer_address}
                                                    onChange={(e) =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customer_address: e.target.value
                                                        }))
                                                    }
                                                />
                                            </div>

                                            {/* Remark */}
                                            <div className="col-md-4">
                                                <label className="form-label">Remark</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Any additional remarks"
                                                    value={formData.remark}
                                                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                                />
                                            </div>

                                            {/* Items Section */}
                                            <div className="col-12 mt-4">
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div className='d-flex gap-4'>
                                                        <h5 className="mb-0">Items</h5>
                                                        <div>
                                                            <div className="d-flex gap-3">
                                                                <label className='form-label'>Stock Type</label>
                                                                <div>
                                                                    <input
                                                                        type="radio"
                                                                        name="stock_type"
                                                                        id="afm"
                                                                        value={0}
                                                                        checked={stock_type === 0}
                                                                        onChange={() => {
                                                                            setStockType(0)
                                                                            setSelectedBrand(null)
                                                                            setItemNumber('')
                                                                        }}
                                                                    />
                                                                    <label htmlFor="afm" className="ms-1">AFM</label>
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        type="radio"
                                                                        name="stock_type"
                                                                        id="oe"
                                                                        value={1}
                                                                        checked={stock_type === 1}
                                                                        onChange={() => {
                                                                            setStockType(1)
                                                                            setSelectedBrand(null)
                                                                            setItemNumber('')
                                                                        }}
                                                                    />
                                                                    <label htmlFor="oe" className="ms-1">OE</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => {
                                                            setManualMode(!manualMode)
                                                            resetItemForm()
                                                        }}
                                                    >
                                                        <i className={`ri-${manualMode ? 'list-view' : 'edit-box'}-line me-1`}></i>
                                                        {manualMode ? 'Switch to Select Mode' : 'Switch to Manual Mode'}
                                                    </button>
                                                </div>

                                                {!manualMode ? (
                                                    // Select Mode - Item Number Input + Brand Select
                                                    <div className="row g-3 mb-3">
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Item Number <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${itemErrors.item_number ? 'is-invalid' : ''}`}
                                                                placeholder="Enter item number"
                                                                value={itemNumber}
                                                                onChange={(e) => setItemNumber(e.target.value)}
                                                            />
                                                            {itemErrors.item_number && <div className="invalid-feedback">{itemErrors.item_number}</div>}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Brand <span className="text-danger">*</span>
                                                            </label>
                                                            <Select
                                                                options={brandsOptions}
                                                                value={selectedBrand}
                                                                onChange={setSelectedBrand}
                                                                placeholder="Select brand..."
                                                                isClearable
                                                                theme={selectTheme}
                                                                styles={selectStyle}
                                                            />
                                                            {itemErrors.selectedBrand && <div className="text-danger small mt-1">{itemErrors.selectedBrand}</div>}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Item Name <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${itemErrors.item_name ? 'is-invalid' : ''}`}
                                                                placeholder="Enter item name"
                                                                value={selectItemFields.item_name}
                                                                onChange={(e) => handleSelectFieldChange('item_name', e.target.value)}
                                                            />
                                                            {itemErrors.item_name && <div className="invalid-feedback">{itemErrors.item_name}</div>}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Quantity <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className={`form-control ${itemErrors.item_qty ? 'is-invalid' : ''}`}
                                                                placeholder="Enter quantity"
                                                                value={selectItemFields.item_qty}
                                                                onChange={(e) => handleSelectFieldChange('item_qty', e.target.value)}
                                                            />
                                                            {itemErrors.item_qty && <div className="invalid-feedback">{itemErrors.item_qty}</div>}
                                                        </div>

                                                        <div className="col-md-2">
                                                            <label className="form-label">
                                                                Price (AED) <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className={`form-control ${itemErrors.item_price ? 'is-invalid' : ''}`}
                                                                placeholder="Enter price"
                                                                value={selectItemFields.item_price}
                                                                onChange={(e) => handleSelectFieldChange('item_price', e.target.value)}
                                                            />
                                                            {itemErrors.item_price && <div className="invalid-feedback">{itemErrors.item_price}</div>}
                                                        </div>
                                                        <div className="col-md-1">
                                                            <label className="form-label">
                                                                VAT (%) <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className={`form-control ${itemErrors.item_vat ? 'is-invalid' : ''}`}
                                                                placeholder="VAT %"
                                                                value={selectItemFields.item_vat}
                                                                onChange={(e) => handleSelectFieldChange('item_vat', e.target.value)}
                                                            />
                                                            {itemErrors.item_vat && <div className="invalid-feedback">{itemErrors.item_vat}</div>}
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Total Amount (AED)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control bg-light"
                                                                value={selectItemFields.item_total}
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-md-1 d-flex align-items-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary w-100"
                                                                onClick={handleAddItem}
                                                                disabled={!selectedBrand || !itemNumber || !selectItemFields.item_qty}
                                                            >
                                                                <i className="ri-add-line"></i> Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Manual Mode - Brand is optional
                                                    <div className="row g-3 mb-3">
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Item Number <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="item_number"
                                                                className={`form-control ${itemErrors.item_number ? 'is-invalid' : ''}`}
                                                                placeholder="Enter item number"
                                                                value={manualItem.item_number}
                                                                onChange={handleManualItemChange}
                                                            />
                                                            {itemErrors.item_number && <div className="invalid-feedback">{itemErrors.item_number}</div>}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Brand <span className="text-muted">(Optional)</span>
                                                            </label>
                                                            <Select
                                                                options={brandsOptions}
                                                                value={selectedBrand}
                                                                onChange={setSelectedBrand}
                                                                placeholder="Select brand (optional)..."
                                                                isClearable
                                                                theme={selectTheme}
                                                                styles={selectStyle}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Item Name <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="item_name"
                                                                className={`form-control ${itemErrors.item_name ? 'is-invalid' : ''}`}
                                                                placeholder="Enter item name"
                                                                value={manualItem.item_name}
                                                                onChange={handleManualItemChange}
                                                            />
                                                            {itemErrors.item_name && <div className="invalid-feedback">{itemErrors.item_name}</div>}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label">
                                                                Quantity <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="item_qty"
                                                                className={`form-control ${itemErrors.item_qty ? 'is-invalid' : ''}`}
                                                                placeholder="Quantity"
                                                                value={manualItem.item_qty}
                                                                onChange={handleManualItemChange}
                                                            />
                                                            {itemErrors.item_qty && <div className="invalid-feedback">{itemErrors.item_qty}</div>}
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">
                                                                Price (AED) <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                name="item_price"
                                                                className={`form-control ${itemErrors.item_price ? 'is-invalid' : ''}`}
                                                                placeholder="Price"
                                                                value={manualItem.item_price}
                                                                onChange={handleManualItemChange}
                                                            />
                                                            {itemErrors.item_price && <div className="invalid-feedback">{itemErrors.item_price}</div>}
                                                        </div>
                                                        <div className="col-md-1">
                                                            <label className="form-label">
                                                                VAT(%) <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                name="item_vat"
                                                                className={`form-control ${itemErrors.item_vat ? 'is-invalid' : ''}`}
                                                                placeholder="VAT %"
                                                                value={manualItem.item_vat}
                                                                onChange={handleManualItemChange}
                                                            />
                                                            {itemErrors.item_vat && <div className="invalid-feedback">{itemErrors.item_vat}</div>}
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Total Amount (AED)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control bg-light"
                                                                value={manualItem.item_total}
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-md-1 d-flex align-items-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary w-100"
                                                                onClick={handleAddItem}
                                                                disabled={!manualItem.item_number || !manualItem.item_name || !manualItem.item_qty}
                                                            >
                                                                <i className="ri-add-line"></i> Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Items Table */}
                                                {itemsData.length > 0 && (
                                                    <div className="table-responsive mt-3">
                                                        <table className="table table-bordered table-hover">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Item Number</th>
                                                                    <th>Item Name</th>
                                                                    <th>Brand Name</th>
                                                                    <th>Quantity</th>
                                                                    <th>Price (AED)</th>
                                                                    <th>VAT%</th>
                                                                    <th>Total (AED)</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {itemsData.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td className="fw-medium">{item.item_number}</td>
                                                                        <td>{item.item_name}</td>
                                                                        <td>{item.item_brand_name}</td>
                                                                        <td>{item.item_qty}</td>
                                                                        <td>AED {parseFloat(item.item_price).toFixed(2)}</td>
                                                                        <td>{item.item_vat}%</td>
                                                                        <td className="fw-bold">AED {parseFloat(item.item_total).toFixed(2)}</td>
                                                                        <td>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-danger"
                                                                                onClick={() => handleRemoveItem(index)}
                                                                                title="Remove item"
                                                                            >
                                                                                <i className="ri-delete-bin-line"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot className="table-light">
                                                                <tr>
                                                                    <td colSpan="7" className="text-end fw-bold">Grand Total:</td>
                                                                    <td className="fw-bold">
                                                                        AED {itemsData.reduce((sum, item) => sum + parseFloat(item.item_total), 0).toFixed(2)}
                                                                    </td>
                                                                    <td></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-12 mt-4">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="btn btn-primary px-4"
                                                    disabled={submitLoading}
                                                >
                                                    <i className={`ri-${quotation_id ? 'file-edit' : 'save'}-line me-1`} />
                                                    {submitLoading ? 'Processing...' : (quotation_id ? 'Update Quotation' : 'Create Quotation')}
                                                </button>
                                            </div>
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

export default CreateQuotation