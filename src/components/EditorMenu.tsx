import { h, Fragment } from 'preact';
import "@styles/EditorMenu.scss";
import Icon from '@components/Icon';
import { connect } from '@view/connect';
import { useContext, useRef, useState, useMemo, useEffect } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import ContextMenu from '@components/ContextMenu';
import { DropDown, DropDownItem } from '@components/DropDown';
import Input from '@components/Input';
import { useFocusOnMount } from '@view/useFocusOnMount';
import { getAvailableFonts, defaultFontsLookup, defaultFonts, fontTypeLookup } from '@view/fonts';
import ColorPicker from '@components/ColorPicker';
import { ImageAttrs, defaultImageAttrs } from '@editor/nodes/ImageNode';
import LoadingSpinner from '@components/LoadingSpinner';

const maxImageSize = 1; // MB

function EditorMenu({ className }: { className?: string }) {
	const { editor } = useContext(StoreContext);
	const menu = editor.menu;
	const isFirstRun = useRef(true);
	const fontRef = useRef<HTMLButtonElement>(null);
	const fontColorRef = useRef<HTMLButtonElement>(null);
	const highlightRef = useRef<HTMLButtonElement>(null);
	const linkRef = useRef<HTMLButtonElement>(null);
	const headingRef = useRef<HTMLButtonElement>(null);
	const imageRef = useRef<HTMLButtonElement>(null);
	const [isFontEditorOpen, setFontEditorOpen] = useState(false);
	const [isFontColorEditorOpen, setFontColorEditorOpen] = useState(false);
	const [isHighlightEditorOpen, setHighlightEditorOpen] = useState(false);
	const [isLinkEditorOpen, setLinkEditorOpen] = useState(false);
	const [isHeadingEditorOpen, setHeadingEditorOpen] = useState(false);
	const [isImageEditorOpen, setImageEditorOpen] = useState(false);
	const useFocusProps = useFocusOnMount();
	const [fontSearch, setFontSearch] = useState('');
	const availableFonts = useMemo(() => ({
		...getAvailableFonts(),
		[defaultFontsLookup.default]: true,
	}), []);

	useEffect(
		() => {
			if (isFirstRun.current) {
				isFirstRun.current = false;
				return;
			}
			if (!isFontEditorOpen && !isLinkEditorOpen && !isHeadingEditorOpen && !isImageEditorOpen) {
				editor.current.view?.focus();
			}
		},
		[
			isFontEditorOpen,
			isLinkEditorOpen,
			isHeadingEditorOpen,
			isImageEditorOpen,
		]
	);
	
	const [imageAttrs, setImageAttrs] = useState<ImageAttrs>(defaultImageAttrs);
	const [isImageLoading, setImageLoading] = useState(false);
	const [isImageFileSizeWarning, setImageFileSizeWarning] = useState(false);

	useEffect(
		() => {
			if (menu.state?.image.attrs) {
				setImageAttrs(menu.state.image.attrs);
			}
			else {
				setImageAttrs(defaultImageAttrs);
			}
		},
		[menu.state?.image.attrs || null]
	);

	useEffect(
		() => {
			setImageFileSizeWarning(false);
		},
		[isImageEditorOpen]
	);

	if (!menu.exists) {
		return null;
	}

	return <div className={`EditorMenu ${className || ''}`} onMouseDown={e => e.preventDefault()}>
		<button
			disabled={!menu.state.history.canUndo}
			className="EditorMenu__Button"
			onClick={menu.actions.history.undo}
			title="Undo action"
		>
			<Icon type='undo' />
		</button>
		<button
			disabled={!menu.state.history.canRedo}
			className="EditorMenu__Button"
			onClick={menu.actions.history.redo}
			title="Redo action"
		>
			<Icon type='redo' />
		</button>
		<button
			disabled={!menu.state.heading.canToggle}
			className={`EditorMenu__Button ${
				(isHeadingEditorOpen || menu.state.heading.canToggle && menu.state.heading.isCurrent) ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => setHeadingEditorOpen(!isHeadingEditorOpen)}
			title="Heading"
			ref={headingRef}
		>
			<Icon type="title" />
		</button>
		{
			menu.state.heading.canToggle && isHeadingEditorOpen && <ContextMenu
				onClose={() => setHeadingEditorOpen(false)}
				relativeRef={headingRef}
			>
				<DropDown className="EditorMenu__HeadingEditor">
					{
						menu.state.heading.isCurrent &&
							<DropDownItem label="Remove heading" iconType="format_clear" onClick={menu.actions.heading.remove} />
					}
					<DropDownItem
						label={`Heading level 1`}
						onClick={() => menu.actions.heading.setLevel(1)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 1}
					>
						<h1>Heading level 1</h1>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 2`}
						onClick={() => menu.actions.heading.setLevel(2)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 2}
					>
						<h2>Heading level 2</h2>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 3`}
						onClick={() => menu.actions.heading.setLevel(3)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 3}
					>
						<h3>Heading level 3</h3>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 4`}
						onClick={() => menu.actions.heading.setLevel(4)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 4}
					>
						<h4>Heading level 4</h4>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 5`}
						onClick={() => menu.actions.heading.setLevel(5)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 5}
					>
						<h5>Heading level 5</h5>
					</DropDownItem>
					<DropDownItem
						label={`Heading level 6`}
						onClick={() => menu.actions.heading.setLevel(6)}
						selected={menu.state.heading.isCurrent && menu.state.heading.level === 6}
					>
						<h6>Heading level 6</h6>
					</DropDownItem>
				</DropDown>
			</ContextMenu>
		}
		<button
			disabled={!menu.state.strong.canToggle}
			className={`EditorMenu__Button ${
				menu.state.strong.canToggle && menu.state.strong.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.strong.toggle}
			title="Bold"
		>
			<Icon type="format_bold" />
		</button>
		<button
			disabled={!menu.state.em.canToggle}
			className={`EditorMenu__Button ${
				menu.state.em.canToggle && menu.state.em.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.em.toggle}
			title="Italics"
		>
			<Icon type="format_italic" />
		</button>
		<button
			disabled={!menu.state.underline.canToggle}
			className={`EditorMenu__Button ${
				menu.state.underline.canToggle && menu.state.underline.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.underline.toggle}
			title="Underlined"
		>
			<Icon type="format_underlined" />
		</button>
		<button
			disabled={!menu.state.strikethrough.canToggle}
			className={`EditorMenu__Button ${
				menu.state.strikethrough.canToggle && menu.state.strikethrough.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.strikethrough.toggle}
			title="Strikethrough"
		>
			<Icon type="format_strikethrough" />
		</button>
		<button
			ref={fontRef}
			disabled={!menu.state.font_size.canToggle && !menu.state.font_family.canToggle}
			className={`EditorMenu__Button ${
				(isFontEditorOpen || menu.state.font_size.canToggle && menu.state.font_size.isCurrent ||
				menu.state.font_family.canToggle && menu.state.font_family.isCurrent)
					? `EditorMenu__Button--active`
					: ``
			}`}
			onClick={() => setFontEditorOpen(!isFontEditorOpen)}
			title="Font"
		>
			<Icon type="format_size" />
		</button>
		{
			(menu.state.font_size.canToggle || menu.state.font_family.canToggle) && isFontEditorOpen && <ContextMenu
				onClose={() => setFontEditorOpen(false)}
				relativeRef={fontRef}
			>
				<DropDown className="EditorMenu__FontEditor">
					{
						menu.state.font_size.canToggle &&
							<DropDownItem
								className="EditorMenu__FontEditorItem"
								labelProps={{ className: "EditorMenu__DropDownFieldWithUnit" }}
							>
								<Input
									className="EditorMenu__FontSizeInput"
									iconType="format_size"
									type="number"
									placeholder="Font size"
									fieldClassName="EditorMenu__FieldWithUnit"
									value={
										menu.state.font_size.isCurrent
											? menu.state.font_size.attrs.fontSize
											: ''
									}
									onChange={e => menu.actions.font_size.setFontSize(
										Number(e.currentTarget.value)
									)}
									{...useFocusProps}
								/>
								<span className="EditorMenu__FieldUnit">(px)</span>
								<button
									className="EditorMenu__FontSizeDefault"
									title="Reset font size to default"
									onClick={menu.actions.font_size.reset}
								>
									<Icon type="format_clear" />
								</button>
							</DropDownItem>
					}
					{
						menu.state.font_family.canToggle &&
							<Fragment>
								<DropDownItem
									className="EditorMenu__FontEditorItem"
									labelProps={{ className: "EditorMenu__FontSearch" }}
								>
									<Input
										iconType="search"
										placeholder="Search font"
										value={fontSearch}
										onInput={e => setFontSearch(e.currentTarget.value)}
									/>
								</DropDownItem>
								<div className="EditorMenu__FontFamilies">
									{
										defaultFonts.map(font =>
											availableFonts[font] && (!fontSearch || font.toLowerCase().indexOf(fontSearch.toLowerCase()) >= 0) &&
												<DropDownItem
													className="EditorMenu__FontFamily"
													label={font}
													labelProps={{ className: `EditorMenu__FontFamilyContainer` }}
													onClick={() => {
														editor.current.view?.focus();
														if (font === defaultFontsLookup.default) {
															menu.actions.font_family.reset();
														}
														else {
															menu.actions.font_family.setFontFamily(font);
														}
													}}
													selected={
														!menu.state.font_family.isCurrent && font === defaultFontsLookup.default ||
														menu.state.font_family.isCurrent && font === menu.state.font_family.attrs.fontFamily
													}
													style={{
														fontFamily: `"${font}",${fontTypeLookup[font]}`,
													}}
												>
													<div className="EditorMenu__FontFamilyLabel">
														{font}
													</div>
													<div className="EditorMenu__FontFamilyExample">
														The quick brown fox jumps over the lazy dog
													</div>
												</DropDownItem>
										)
									}
								</div>
							</Fragment>
					}
				</DropDown>
			</ContextMenu>
		}
		<button
			ref={fontColorRef}
			disabled={!menu.state.font_color.canToggle}
			className={`EditorMenu__Button ${
				(isFontColorEditorOpen || menu.state.font_color.canToggle && menu.state.font_color.isCurrent)
					? `EditorMenu__Button--active`
					: ``
			}`}
			onClick={() => setFontColorEditorOpen(!isFontColorEditorOpen)}
			title="Font color"
		>
			<Icon type="format_color_text" style={{
				color: menu.state.font_color.canToggle && menu.state.font_color.isCurrent
					? `#${menu.state.font_color.attrs.color}`
					: 'currentColor'
			}} />
		</button>
		{
			menu.state.font_color.canToggle && isFontColorEditorOpen && <ContextMenu
				onClose={() => setFontColorEditorOpen(false)}
				relativeRef={fontColorRef}
			>
				<ColorPicker currentColor={menu.state.font_color.attrs.color} onColor={color => {
					editor.current.view?.focus();
					if (!color) {
						menu.actions.font_color.reset();
					}
					else {
						menu.actions.font_color.setColor(color);
					}
				}} />
			</ContextMenu>
		}
		<button
			ref={highlightRef}
			disabled={!menu.state.highlight.canToggle}
			className={`EditorMenu__Button ${
				(isHighlightEditorOpen || menu.state.highlight.canToggle && menu.state.highlight.isCurrent)
					? `EditorMenu__Button--active`
					: ``
			}`}
			onClick={() => setHighlightEditorOpen(!isHighlightEditorOpen)}
			title="Highlight color"
		>
			<Icon type="highlight" style={{
				color: menu.state.highlight.canToggle && menu.state.highlight.isCurrent
					? `#${menu.state.highlight.attrs.color}`
					: 'currentColor'
			}} />
		</button>
		{
			menu.state.highlight.canToggle && isHighlightEditorOpen && <ContextMenu
				onClose={() => setHighlightEditorOpen(false)}
				relativeRef={highlightRef}
			>
				<ColorPicker currentColor={menu.state.highlight.attrs.color} onColor={color => {
					editor.current.view?.focus();
					if (!color) {
						menu.actions.highlight.reset();
					}
					else {
						menu.actions.highlight.setColor(color);
					}
				}} />
			</ContextMenu>
		}
		<button
			ref={linkRef}
			disabled={!menu.state.link.canToggle}
			className={`EditorMenu__Button ${
				(isLinkEditorOpen || menu.state.link.canToggle && menu.state.link.isCurrent) ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => setLinkEditorOpen(!isLinkEditorOpen)}
			title="Link"
		>
			<Icon type="link" />
		</button>
		{
			menu.state.link.canToggle && isLinkEditorOpen && <ContextMenu
				onClose={() => setLinkEditorOpen(false)}
				relativeRef={linkRef}
			>
				<DropDown>
					{
						!menu.state.link.isSelected
							? <DropDownItem className="EditorMenu__LinkEditorUnselected">
								Select text to make a link
							</DropDownItem>
							: <Fragment>
								<DropDownItem>
									<Input
										iconType="link"
										placeholder="Link"
										value={menu.state.link.attrs.href}
										onInput={e => menu.actions.link.createUpdate({
											href: e.currentTarget.value,
											title: menu.state.link.attrs.title,
										})}
										{...useFocusProps}
									/>
								</DropDownItem>
								<DropDownItem>
									<Input
										iconType="title"
										placeholder="Title (optional)"
										value={menu.state.link.attrs.title}
										onInput={e => menu.actions.link.createUpdate({
											href: menu.state.link.attrs.href,
											title: e.currentTarget.value,
										})}
									/>
								</DropDownItem>
								{
									menu.state.link.isCurrent &&
										<DropDownItem
											iconType="delete"
											label="Remove link"
											onClick={menu.actions.link.remove}
										/>
								}
							</Fragment>
					}
				</DropDown>
			</ContextMenu>
		}
		<button
			disabled={!menu.state.code.canToggle}
			className={`EditorMenu__Button ${
				menu.state.code.canToggle && menu.state.code.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.code.toggle}
			title="Inline code"
		>
			<Icon type="code" />
		</button>
		<button
			disabled={!menu.state.code_block.canToggle}
			className={`EditorMenu__Button EditorMenu__CodeBlock ${
				menu.state.code_block.canToggle && menu.state.code_block.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.code_block.toggle}
			title="Code block"
		>
			<Icon className="EditorMenu__CodeBlock-Code" type="code" />
			<Icon className="EditorMenu__CodeBlock-Block" type="short_text" />
		</button>
		<button
			disabled={!menu.state.blockquote.canToggle}
			className={`EditorMenu__Button ${
				menu.state.blockquote.canToggle && menu.state.blockquote.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.blockquote.toggle}
			title="Quote block"
		>
			<Icon type="format_quote" />
		</button>
		<button
			className="EditorMenu__Button"
			onClick={menu.actions.horizontal_rule.add}
			title="Horizontal rule"
		>
			<Icon type="horizontal_rule" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'left' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'left',
			})}
			title="Align: Left"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_left" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'center' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'center',
			})}
			title="Align: center"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_center" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'justify' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'justify',
			})}
			title="Align: justify"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_justify" />
		</button>
		<button
			className={`EditorMenu__Button ${
				menu.state.paragraph.isCurrent && menu.state.paragraph.attrs.textAlign === 'right' ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => menu.actions.paragraph.setAttrs({
				...menu.state.paragraph.attrs,
				textAlign: 'right',
			})}
			title="Align: right"
			disabled={!menu.state.paragraph.isCurrent}
		>
			<Icon type="format_align_right" />
		</button>
		<button
			disabled={!menu.state.bullet_list.canToggle}
			className={`EditorMenu__Button ${
				menu.state.bullet_list.canToggle && menu.state.bullet_list.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.bullet_list.toggle}
			title="Bulleted list"
		>
			<Icon type="format_list_bulleted" />
		</button>
		<button
			disabled={!menu.state.ordered_list.canToggle}
			className={`EditorMenu__Button ${
				menu.state.ordered_list.canToggle && menu.state.ordered_list.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.ordered_list.toggle}
			title="Numbered list"
		>
			<Icon type="format_list_numbered" />
		</button>
		<button
			disabled={!menu.state.todo_list.canToggle}
			className={`EditorMenu__Button ${
				menu.state.todo_list.canToggle && menu.state.todo_list.isCurrent ? `EditorMenu__Button--active`: ``
			}`}
			onClick={menu.actions.todo_list.toggle}
			title="Todo list"
		>
			<Icon type="list_alt" />
		</button>
		<button
			disabled={!menu.state.list_items.canDecreaseIndent}
			className="EditorMenu__Button"
			onClick={menu.actions.list_items.decreaseIndent}
			title="Decrease list indent"
		>
			<Icon type="format_indent_decrease" />
		</button>
		<button
			disabled={!menu.state.list_items.canIncreaseIndent}
			className="EditorMenu__Button"
			onClick={menu.actions.list_items.increaseIndent}
			title="Increase list indent"
		>
			<Icon type="format_indent_increase" />
		</button>
		<button
			ref={imageRef}
			className={`EditorMenu__Button ${
				(isImageEditorOpen || menu.state.image.isCurrent) ? `EditorMenu__Button--active`: ``
			}`}
			onClick={() => setImageEditorOpen(!isImageEditorOpen)}
			title="Image"
		>
			<Icon type="image" />
		</button>
		{
			isImageEditorOpen && <ContextMenu
				onClose={() => setImageEditorOpen(false)}
				relativeRef={imageRef}
			>
				<DropDown className={`EditorMenu__ImageEditor ${
					isImageLoading ? `EditorMenu__ImageEditor--loading` : ``
				}`}>
					{
						isImageLoading && <LoadingSpinner className="EditorMenu__ImageLoading" />
					}
					<DropDownItem>
						<Input
							iconType="link"
							placeholder="Enter URL"
							value={imageAttrs.src || ''}
							onInput={e => setImageAttrs({
								...imageAttrs,
								src: e.currentTarget.value,
							})}
						/>
					</DropDownItem>
					{isImageFileSizeWarning && <DropDownItem
						className="EditorMenu__ImageSizeWarning"
						iconType="warning"
						label={`Image can't exceed ${maxImageSize}MB`}
					/>}
					<DropDownItem isLink tag="label" for="EditorMenu__ImageFileBrowse" iconType="folder_open" label="Browse">
						<span>Or, browse</span>
						<input
							id="EditorMenu__ImageFileBrowse"
							name="EditorMenu__ImageFileBrowse"
							className="EditorMenu__ImageFileBrowse"
							type="file"
							accept="image/*"
							onChange={e => {
								const { currentTarget: input } = e;
								if (input.files && input.files[0]) {
									const file = input.files[0];

									if (file.size > maxImageSize * 1024 * 1024) {
										setImageFileSizeWarning(true);
									}
									else {
										const reader = new FileReader();
	
										setImageFileSizeWarning(false);
										setImageLoading(true);
										
										reader.addEventListener('load', e => {
											setImageLoading(false);
											setImageAttrs({
												...imageAttrs,
												src: reader.result as string,
											});
										});
										
										reader.addEventListener('error', () => {
											setImageLoading(false);
										});
										
										reader.readAsDataURL(file);
									}
								}
							}}
						/>
					</DropDownItem>
					<DropDownItem>
						<Input
							iconType="title"
							placeholder="Title (optional)"
							value={imageAttrs.title || ''}
							onInput={e => setImageAttrs({
								...imageAttrs,
								title: e.currentTarget.value,
							})}
						/>
					</DropDownItem>
					<DropDownItem labelProps={{ className: "EditorMenu__DropDownFieldWithUnit" }}>
						<Input
							iconType="border_horizontal"
							placeholder="Width (optional)"
							fieldClassName="EditorMenu__FieldWithUnit"
							value={imageAttrs.width || ''}
							onInput={e => setImageAttrs({
								...imageAttrs,
								width: Number(e.currentTarget.value) || null,
							})}
						/>
						<span className="EditorMenu__FieldUnit">(px)</span>
					</DropDownItem>
					<DropDownItem labelProps={{ className: "EditorMenu__DropDownFieldWithUnit" }}>
						<Input
							iconType="border_vertical"
							placeholder="Height (optional)"
							fieldClassName="EditorMenu__FieldWithUnit"
							value={imageAttrs.height || ''}
							onInput={e => setImageAttrs({
								...imageAttrs,
								height: Number(e.currentTarget.value) || null,
							})}
						/>
						<span className="EditorMenu__FieldUnit">(px)</span>
					</DropDownItem>
					<DropDownItem>
						<div className="EditorMenu__ImagePositionLabel">Position:</div>
						<div className="EditorMenu__ImagePositions">
							<button
								title="Float to the left of text"
								onClick={() => setImageAttrs({ ...imageAttrs, position: 'left' })}
								className={`EditorMenu__ImageButton ${
									imageAttrs.position === 'left' ? `EditorMenu__ImageButton--active` : ``
								}`}
							>
								<Icon type="image" />
							</button>
							<Icon type="format_align_justify" />
							<div className="EditorMenu__ImageCentralPositions">
								<button
									title="To the top of the line"
									onClick={() => setImageAttrs({ ...imageAttrs, position: 'top' })}
									className={`EditorMenu__ImageButton ${
										imageAttrs.position === 'top' ? `EditorMenu__ImageButton--active` : ``
									}`}
								>
									<Icon type="image" />
								</button>
								<button
									title="In the middle of the line"
									onClick={() => setImageAttrs({ ...imageAttrs, position: 'middle' })}
									className={`EditorMenu__ImageButton ${
										imageAttrs.position === 'middle' ? `EditorMenu__ImageButton--active` : ``
									}`}
								>
									<Icon type="image" />
								</button>
								<button
									title="To the bottom of the line"
									onClick={() => setImageAttrs({ ...imageAttrs, position: 'bottom' })}
									className={`EditorMenu__ImageButton ${
										imageAttrs.position === 'bottom' ? `EditorMenu__ImageButton--active` : ``
									}`}
								>
									<Icon type="image" />
								</button>
							</div>
							<Icon type="format_align_justify" />
							<button
								title="Float to the right of text"
								onClick={() => setImageAttrs({ ...imageAttrs, position: 'right' })}
								className={`EditorMenu__ImageButton ${
									imageAttrs.position === 'right' ? `EditorMenu__ImageButton--active` : ``
								}`}
							>
								<Icon type="image" />
							</button>
						</div>
					</DropDownItem>
					<DropDownItem
						iconType="add_photo_alternate"
						label={
							menu.state.image.isCurrent
								? "Update image"
								: "Add image"
						}
						onClick={() => {
							if (menu.state.image.isCurrent) {
								menu.actions.image.setAttrs(imageAttrs);
								
							}
							else {
								menu.actions.image.create(imageAttrs);
							}
							editor.current.view?.focus();
						}}
					/>
					{
						menu.state.image.isCurrent &&
							<DropDownItem
								iconType="delete"
								label="Remove image"
								onClick={menu.actions.image.remove}
							/>
					}
				</DropDown>
			</ContextMenu>
		}
	</div>
}

export default connect(EditorMenu);