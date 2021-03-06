import { shallow } from 'enzyme';
import * as React from 'react';

import { Editors } from '../../../src/renderer/components/editors';
import { getFocusedEditor } from '../../../src/utils/focused-editor';

jest.mock('../../../src/renderer/components/editor', () => ({
  Editor: 'Editor'
}));

jest.mock('../../../src/utils/focused-editor', () => ({
  getFocusedEditor: jest.fn()
}));

describe('Editrors component', () => {
  let store: any;
  let monaco: any;

  beforeEach(() => {
    store = {
      isTokenDialogShowing: false,
      isSettingsShowing: false
    };

    monaco = {
      editor: {
        defineTheme: jest.fn()
      }
    };
  });

  it('renders', () => {
    const wrapper = shallow(<Editors appState={store} />);
    wrapper.setState({ monaco });
    expect(wrapper).toMatchSnapshot();
  });

  it('executes a command on an editor', () => {
    const wrapper = shallow(<Editors appState={store} />);
    const instance = wrapper.instance();
    const mockAction = {
      isSupported: jest.fn(() => true),
      run: jest.fn()
    };
    const mockEditor = {
      getAction: jest.fn(() => mockAction)
    };

    (getFocusedEditor as any).mockReturnValueOnce(mockEditor);

    (instance as any).executeCommand('hello');
    expect(mockEditor.getAction).toHaveBeenCalled();
    expect(mockAction.isSupported).toHaveBeenCalled();
    expect(mockAction.run).toHaveBeenCalled();
  });

  it('does not execute command if not supported', () => {
    const wrapper = shallow(<Editors appState={store} />);
    const instance = wrapper.instance();
    const mockAction = {
      isSupported: jest.fn(() => false),
      run: jest.fn()
    };
    const mockEditor = {
      getAction: jest.fn(() => mockAction)
    };

    (getFocusedEditor as any).mockReturnValueOnce(mockEditor);

    (instance as any).executeCommand('hello');
    expect(mockEditor.getAction).toHaveBeenCalled();
    expect(mockAction.isSupported).toHaveBeenCalled();
    expect(mockAction.run).toHaveBeenCalledTimes(0);
  });
});
