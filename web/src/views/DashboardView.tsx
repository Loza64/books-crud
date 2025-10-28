import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Button, Space, message, Select, Modal, Input, Form } from "antd";
import { useApiService } from "../hooks/useApi";
import booksService from "../service/api/BooksService";
import genderService from "../service/api/GenderService";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type Book from "../model/Book";
import type Gender from "../model/Gender";

const { Option } = Select;

export default function DashboardView() {
    const {
        list: listBooks,
        loading,
        params,
        setPage,
        setPageSize,
        setFilter,
        getById,
        item: selectedBook,
        create,
        total,
        pages,
    } = useApiService<Book>(booksService);

    const [listGenders, setListGenders] = useState<Gender[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        genderService.findAll({ params: { page: 0, size: 100 } })
            .then(res => setListGenders(res.content))
            .catch(() => message.error("No se pudieron cargar los géneros"));
    }, []);

    const gendersMap = useMemo(() => {
        const map = new Map<number, Gender>();
        listGenders.forEach(g => map.set(g.id!, g));
        return map;
    }, [listGenders]);


    const genderOptions = useMemo(
        () => listGenders.map(g => <Option key={g.id} value={g.id}>{g.name}</Option>),
        [listGenders]
    );

    const viewBook = useCallback(async (book: Book) => {
        try {
            await getById(book.id!);
            setIsModalVisible(true);
        } catch {
            message.error("No se pudo cargar el libro");
        }
    }, [getById]);


    const handleCreateBook = async (values: Book) => {
        try {
            const payload: Book = {
                ...values,
                gender: gendersMap.get(values.gender as number)!.id!
            };
            await create(payload);
            message.success("Libro creado correctamente");
            setIsCreateModalVisible(false);
            form.resetFields();
        } catch {
            message.error("Error al crear el libro");
        }
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (pagination.current && pagination.current - 1 !== params.page) {
            setPage(pagination.current - 1);
        }
        if (pagination.pageSize && pagination.pageSize !== params.size) {
            setPageSize(pagination.pageSize);
        }
    };

    const handleFilterChange = (value: number | null) => {
        setFilter("gender", value ?? undefined);
    };

    const columns: ColumnsType<Book> = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" },
        { title: "Nombre", dataIndex: "name", key: "name", align: "center" },
        { title: "Autor", dataIndex: "author", key: "author", align: "center" },
        {
            title: "Género",
            dataIndex: "gender",
            key: "gender",
            align: "center",
            render: (gender) => typeof gender === "object" ? gender.name : gender,
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => viewBook(record)}>Ver</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Filtros y botón crear */}
            <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
                <Select
                    placeholder="Filtrar por género"
                    style={{ width: '100%' }}
                    allowClear
                    value={params.gender}
                    onChange={handleFilterChange}
                >
                    {genderOptions}
                </Select>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>Crear Libro</Button>
            </div>

            <Table<Book>
                columns={columns}
                dataSource={listBooks}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: params.page + 1,
                    pageSize: params.size,
                    total,
                    showSizeChanger: true,
                    position: ["bottomCenter"],
                }}
                onChange={handleTableChange}
            />

            <Modal
                title="Detalle del Libro"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                okText="Cerrar"
                cancelButtonProps={{ style: { display: "none" } }}
            >
                {selectedBook ? (
                    <div>
                        <p><strong>ID:</strong> {selectedBook.id}</p>
                        <p><strong>Nombre:</strong> {selectedBook.name}</p>
                        <p><strong>Autor:</strong> {selectedBook.author}</p>
                        <p><strong>Género:</strong> {(selectedBook.gender as Gender)?.name}</p>
                    </div>
                ) : <p>Cargando...</p>}
            </Modal>

            <Modal
                title="Crear Libro"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
                okText="Crear"
            >
                <Form form={form} layout="vertical" onFinish={handleCreateBook}>
                    <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="author" label="Autor" rules={[{ required: true, message: "Ingrese el autor" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Género" rules={[{ required: true, message: "Seleccione un género" }]}>
                        <Select placeholder="Seleccione un género">
                            {genderOptions}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{ marginBottom: 8 }}>
                Total de registros: {total} | Total de páginas: {pages}
            </div>
        </div>
    );
}
