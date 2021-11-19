import React, { useEffect, useRef, useState } from 'react';
import { SubCustomDragLayer } from '../SubCustomDragLayer';
import { SubContainer } from '../SubContainer';
import { resolveReferences, resolveWidgetFieldValue } from '@/_helpers/utils';

export const Tabs = function Tabs({ id, component, height, containerProps, currentState, removeComponent }) {
  const widgetVisibility = component.definition.styles?.visibility?.value ?? true;
  const disabledState = component.definition.styles?.disabledState?.value ?? false;

  // config for tabs. Includes title
  const tabs = component.definition.properties?.tabs?.value ?? [];
  let parsedTabs = tabs;
  parsedTabs = resolveWidgetFieldValue(parsedTabs, currentState);

  // Highlight color - for active tab text and border
  const highlightColor = component.definition.styles?.highlightColor?.value ?? '';
  let parsedHighlightColor = highlightColor;
  parsedHighlightColor = resolveWidgetFieldValue(highlightColor, currentState);

  const parsedDisabledState =
    typeof disabledState !== 'boolean' ? resolveWidgetFieldValue(disabledState, currentState) : disabledState;

  let parsedWidgetVisibility = widgetVisibility;

  try {
    parsedWidgetVisibility = resolveReferences(parsedWidgetVisibility, currentState, []);
  } catch (err) {
    console.log(err);
  }

  const computedStyles = {
    height,
    display: parsedWidgetVisibility ? 'flex' : 'none',
  };

  const parentRef = useRef(null);

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div
      data-disabled={parsedDisabledState}
      className="jet-tabs card"
      onClick={(e) => { containerProps.onComponentClick(id, component) }}
      style={computedStyles}
    >
      <ul class="nav nav-tabs" data-bs-toggle="tabs">

        {parsedTabs.map((tab, index) =>
          <li class="nav-item" onClick={() => setCurrentTab(1)}>
            <a class={`nav-link ${currentTab === index ? 'active' : ''}`} style={currentTab === index ? { color: parsedHighlightColor, borderBottom: `1px solid ${parsedHighlightColor}` } : {}}>{tab.title}</a>
          </li>
        )}

      </ul>
      <div class="tab-content" ref={parentRef} id={`${id}-${currentTab}`}>
        <div class="tab-pane active show">
          <SubContainer parent={`${id}-${currentTab}`} {...containerProps} parentRef={parentRef} removeComponent={removeComponent} />
          <SubCustomDragLayer parent={id} parentRef={parentRef} currentLayout={containerProps.currentLayout} />
        </div>
      </div>

    </div>
  );
};
