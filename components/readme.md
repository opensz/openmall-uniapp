### examWidght 在线答题,试卷测试

在线答题组件，组件名：``examWidght``。
支持单选，多选，填空，我觉得判断题可以做成单选形式，所以就没有添加。
有些字段是按照我的项目来写的，请根据自己的需求修改。

**使用方式：**

在 ``script`` 中引用组件 

```javascript
import examWidght from '@/components/exam-widget/exam-widget.vue';

export default {
    components: {examWidght}
}

```


**用法：**

```html
<exam-widght :dataList='QuestionList' :index="index" @select='selectItem' @selectFinish='selectFinish' @finish='finish'>
</exam-widght>
```
 
**属性说明：**

|属性名		|类型		|默认值	|说明																		|
|---		|----		|---	|---																		|
|index		|Number		|0		|起始题号，外部可通过此参数修改当前题号										|
|dataList	|array		|[]		|题目列表																	|
|finishText	|String		|完成		|按键文字										|
|lastText	|String		|上一题		|按键文字																	|
|nextText	|String		|下一题		|按键文字										|
|indexText	|String		|题号		|按键文字																	|

**事件：**

|事件名				|说明																		|
|---				|---																		|
|select				|题目类型为单选或者多选时，选择或者切换选择触发																	|
|selectFinish		|切换题目时触发，包括点击上一题、下一题、点击题号、外部修改题号																	|
|finish				|点击完成时触发																	|

**1.0.0**
- 初始项目
