/* eslint-disable no-console */
import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions = [
  {
    label: '福建',
    isLeaf: false,
    value: 'fj',
  },
  {
    label: '浙江',
    isLeaf: false,
    value: 'zj',
  },
];

class Demo extends React.Component {
  timer = null;

  state = {
    inputValue: '',
    options: addressOptions,
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  };

  onPopupVisibleChange = visible => {
    if (!visible) {
      // 浮层关闭的时候，取消异步请求
      this.cancelRequest();
    }
    console.log(`visible is: ${visible}`);
  };

  // 取消请求，设置loading为false
  cancelRequest = () => {
    clearTimeout(this.timer);
    if (this.activeOption) {
      this.activeOption.loading = false;
    }
  };

  // 点击另一个节点的时候，取消异步请求
  onItemClick = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 判断用户是否一直点击
    if (this.activeOption !== targetOption) {
      this.cancelRequest();
    }
    console.log(selectedOptions);
  };

  loadData = (selectedOptions, done) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    this.activeOption = targetOption;
    targetOption.loading = true;
    // 动态加载下级数据
    this.timer = setTimeout(() => {
      targetOption.loading = false;
      if (targetOption.value === 'fj') {
        targetOption.children = [];
        targetOption.isLeaf = true;
      } else {
        targetOption.children = [
          {
            label: `${targetOption.label}动态加载1`,
            value: 'dynamic1',
          },
          {
            label: `${targetOption.label}动态加载2`,
            value: 'dynamic2',
          },
        ];
      }
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        options: [...this.state.options],
      });
      // 组件内部返回的异步回调函数，作用为:
      // 如果当前节点children为空数组且noData为null；调用触发onChange设置value值，并且隐藏浮层
      done();
    }, 2000);
  };

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        onPopupVisibleChange={this.onPopupVisibleChange}
        onItemClick={this.onItemClick}
        noData="无数据"
      >
        <input value={this.state.inputValue} readOnly placeholder="please select address" />
      </Cascader>
    );
  }
}

export default Demo;
