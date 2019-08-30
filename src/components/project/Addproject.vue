<template>
    <div class="addproject">
        <el-dialog
            :title="!dialogType ? '新增产品' : '修改产品'"
            :visible="dialogFormVisible"
            width="45%"
            center
            @close="hideDialog"
        >
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品名称：" prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品分类：" prop="sort">
                            <el-input v-model="form.sort" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品单位：" prop="units">
                            <el-input v-model="form.units" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成本：" prop="cost">
                            <el-input v-model="form.cost" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="售价：" prop="price">
                            <el-input v-model="form.price" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品图片：" prop="photo">
                            <el-input v-model="form.photo" autocomplete="off"></el-input>
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
                sort: '',
                units: '',
                cost: '',
                price: '',
                photo: ''
            },
            rules: {
                name: [
                    // { required: true, message: '请输入客户名称', trigger: 'blur' },
                    //     { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    // ],
                    // phone: [{ required: true, message: '请输入联系方式', trigger: 'change' }],
                    // address: [{ required: true, message: '请选择省区市', trigger: 'change' }],
                    // detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        },
        dialogType: {
            type: Boolean,
            default: false
        },
        editData: {
            type: Object,
            default: {}
        }
    },
    watch: {
        editData: {
            handler(val) {
                if (!this.dialogType) {
                    Object.keys(this.form).map(r => {
                        this.form[r] = r === 'address' ? ['340000', '340200', '340225'] : '';
                    });
                    this.$nextTick(() => {
                        if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
                    });
                } else {
                    Object.keys(this.form).map(r => {
                        this.form[r] = r === 'address' ? val[r].split(',') : val[r];
                    });
                }
            },
            immediate: true
        }
    },
    methods: {
        hideDialog(type = false) {
            this.$emit('dialog', type);
        },
        confirm() {
            this.$refs['ruleForm'].validate(valid => {
                if (!valid) return;
                let location = this.dialogType ? '/editCust' : '/addCust';
                this.$post(
                    location,
                    Object.assign({}, this.form, { address: this.form.address.join(','), id: this.editData.id || 0 })
                ).then((r, data = r.data) => {
                    this.$notify({
                        title: this.dialogType ? '修改成功' : '新增成功',
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