<template>
    <div class="customer">
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="45%" @close="hideDialog()">
            <el-form :model="form" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名：">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式：">
                            <el-input v-model="form.phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省市区：">
                            <el-cascader
                                :options="cityData"
                                v-model="form.address"
                                clearable
                                class="w-100"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址：">
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
            this.$emit('dialog', type);
        },
        confirm() {
            this.$post('/addCust', Object.assign({}, this.form, { address: this.form.address.join(',') })).then(data => {
                this.$notify({
                    title: '成功',
                    message: data.message,
                    type: 'success'
                });
                this.hideDialog(true);
            });
        }
    },
    computed: {
        cityData() {
            return city || [];
        }
    },
    mounted() {
        this.$post('queryCust').then(data => {
            console.log(data);
        });
    }
};
</script>
<style lang="stylus" scoped></style>