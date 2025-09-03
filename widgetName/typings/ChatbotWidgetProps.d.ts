/**
 * This file was generated from ChatbotWidget.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type ChatbotwidgetTypeEnum = "badge" | "label";

export interface ChatbotWidgetContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | Big>;
    chatbotwidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    chatbotwidgetType: ChatbotwidgetTypeEnum;
    onClickAction?: ActionValue;
}

export interface ChatbotWidgetPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    valueAttribute: string;
    chatbotwidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    chatbotwidgetType: ChatbotwidgetTypeEnum;
    onClickAction: {} | null;
}
