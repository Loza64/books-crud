import { useEffect, useState } from "react";
import type Gender from "../model/Gender";
import genderService from "../service/api/GenderService";
import { useApiService } from "../hooks/useApi";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Button, Table, message, Modal, Input, Form } from "antd";

export default function GenderView() {
    const {
        list: listGenders,
        loading,
        params,
        total,
        setPage,
        setPageSize,
        getAll,
        create,
    } = useApiService<Gender>(genderService);

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        getAll();
    }, [params, getAll]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (pagination.current && pagination.current - 1 !== params.page) setPage(pagination.current - 1);
        if (pagination.pageSize && pagination.pageSize !== params.size) setPageSize(pagination.pageSize);
    };

    const handleCreateGender = async (values: Gender) => {
        try {
            await create(values);
            message.success("Género creado correctamente");
            setIsCreateModalVisible(false);
            form.resetFields();
        } catch {
            message.error("Error al crear el género");
        }
    };

    const columns: ColumnsType<Gender> = [
        { title: "ID", dataIndex: "id", key: "id", align: 'center' },
        { title: "Nombre", dataIndex: "name", key: "name", align: 'center' },
    ];

    return (
        <div>
            {/* Botón crear */}
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                    Crear Género
                </Button>
            </div>

            <Table<Gender>
                columns={columns}
                dataSource={listGenders}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: params.page + 1,
                    pageSize: params.size,
                    total,
                    showSizeChanger: true,
                    position: ["bottomCenter"]
                }}
                onChange={handleTableChange}
            />

            <Modal
                title="Crear Género"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
                okText="Crear"
            >
                <Form form={form} layout="vertical" onFinish={handleCreateGender}>
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: "Ingrese el nombre del género" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
