/* eslint-disable no-console */
import '@gem-mine/rc-cascader/assets/index.less';
import Cascader from '@gem-mine/rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  label: '福建',
  isLeaf: false,
  value: 'fj',
}, {
  label: '浙江',
  isLeaf: false,
  value: 'zj',
}];

class Demo extends React.Component {
  state = {
    inputValue: '',
    options: addressOptions,
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  onItemClick = (activeOptions) => {
    console.log(activeOptions);
  }

  loadData = (selectedOptions, done) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.loading = false;
      if (targetOption.value === 'fj') {
        targetOption.children = [];
        targetOption.isLeaf = true;
      } else {
        targetOption.children = [{
          label: `${targetOption.label}动态加载1`,
          value: 'dynamic1',
        }, {
          label: `${targetOption.label}动态加载2`,
          value: 'dynamic2',
        }];
      }
      this.setState({
        options: [...this.state.options],
      });
      done();
    }, 1000);
  }

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        onItemClick={this.onItemClick}
        noData={null}
        changeOnSelect
      >
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
