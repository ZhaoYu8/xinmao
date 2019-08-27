<template>
    <div class="customer">
        <el-dialog title="收货地址" :visible="dialogFormVisible" width="45%" @close="hideDialog">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名：" prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式：" prop="phone">
                            <el-input v-model="form.phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省市区：" prop="address">
                            <el-cascader
                                :options="cityData"
                                v-model="form.address"
                                clearable
                                class="w-100"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址：" prop="detailaddress">
                            <el-input v-model="form.detailaddress" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog()">取 消</el-button>
                <el-button type="primary" @click="confirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import city from '../../global/city.js';
export default {
    data: function() {
        return {
            form: {
                name: '',
                phone: '',
                address: [],
                detailaddress: '',
                photo: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入客户名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入联系方式', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请选择省区市', trigger: 'change' }
                ],
                detailaddress: [
                    { required: true, message: '请输入详细地址', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideDialog(type = false) {
            this.$refs['ruleForm'].resetFields();
            this.$emit('dialog', type);
        },
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (!valid) return;
                this.$post('/addCust', Object.assign({}, this.form, { address: this.form.address.join(',') })).then((r, data = r.data) => {
                    this.$notify({
                        title: '成功',
                        message: data.message,
                        type: 'success'
                    });
                    this.hideDialog(true);
                });
            });
        }
    },
    computed: {
        cityData() {
            return city || [];
        }
    },
    mounted() {}
};
</script>
<style lang="stylus" scoped></style>