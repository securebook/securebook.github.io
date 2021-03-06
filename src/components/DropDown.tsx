import { h, ComponentChildren } from "preact";
import { IconType } from "@interfaces/Icon";
import Icon from "@components/Icon";
import "@styles/DropDown.scss";
import Link from "@components/Link";

type CommonProps = {
	isLink?: boolean,
	tag?: string,
	selected?: boolean,
	iconType?: IconType,
	label?: string,
	labelProps?: h.JSX.HTMLAttributes<HTMLSpanElement>,
	children?: ComponentChildren,
};

export function DropDownItem(
	{ isLink = false, tag, iconType, label, children, selected = false, labelProps = {}, ...rest }:
	CommonProps & h.JSX.HTMLAttributes<HTMLElement>
) {
	const Tag = (isLink && !tag ? Link : tag) as any || 'div';
	return <Tag
		{...rest}
		title={label}
		className={
			`DropDown__Item ${
				rest.class || rest.className || ''
			} ${
				selected ? `DropDown__Item--selected` : ``
			} ${
				(isLink || rest.onClick) ? `DropDown__Item--with-click` : ``
			}`
		}
	>
		{!!iconType && <span className="DropDown__Icon"><Icon type={iconType} /></span>}
		<span
			{...labelProps}
			className={`DropDown__Label ${
				labelProps.class || labelProps.className || ''
			}`}
		>
			{!children ? label : children}
		</span>
	</Tag>;
}

export function DropDown(props: h.JSX.HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={`DropDown ${props.class || props.className || ''}`} />;
}