import { Component, ReactNode, createElement } from "react";

import { ChatbotWidgetContainerProps } from "../typings/ChatbotWidgetProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/ChatbotWidget.css";

export class ChatbotWidget extends Component<ChatbotWidgetContainerProps> {
    private readonly onClickHandler = this.onClick.bind(this);

    render(): ReactNode {
        return (
            <BadgeSample
                type={this.props.chatbotwidgetType}
                bootstrapStyle={this.props.bootstrapStyle}
                className={this.props.class}
                clickable={!!this.props.onClickAction}
                defaultValue={this.props.chatbotwidgetValue ? this.props.chatbotwidgetValue : ""}
                onClickAction={this.onClickHandler}
                style={this.props.style}
                value={this.props.valueAttribute ? this.props.valueAttribute.displayValue : ""}
            ></BadgeSample>
        );
    }

    private onClick(): void {
        if (this.props.onClickAction && this.props.onClickAction.canExecute) {
            this.props.onClickAction.execute();
        }
    }
}
